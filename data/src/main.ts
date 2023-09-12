import { Server, serve, sleep } from "bun";
import { config } from "../lib/config";
import { F1State } from "./formula1.type";
import { updateState } from "./handler";
import { translate } from "./translators";

console.log("starting...");

let f1_ws: WebSocket | null;
let state: F1State = {};
let active: boolean = false;

const server = serve({
	fetch(req, server) {
		if (req.url.includes("/api/ping")) return new Response(null, { status: 200 });
		if (server.upgrade(req)) return;
		return new Response("Upgrade failed :(", { status: 500 });
	},
	port: config.port,
	websocket: {
		async open(ws) {
			if (!active) {
				state = {};
			}

			active = true;

			ws.subscribe("f1-socket");

			if (!f1_ws) {
				console.log("F1: no socket found");

				await setupF1(server);
			} else {
				console.log("F1: socket found, sending current state");

				ws.send(JSON.stringify(translate(state)));
			}

			console.log("SERVER: current connections", server.pendingWebSockets);
		},
		message(_, message) {
			console.log("WS: got message:", message);
		},
		close(ws) {
			console.log("WS: got disconnect!");

			ws.unsubscribe("f1-socket");

			if (server.pendingWebSockets < 2) {
				console.log("no connections left, killing web socket");

				if (f1_ws && active) {
					active = false;
					f1_ws.close();
				}
			}
		},
	},
});

const setupF1 = async (wss: Server) => {
	if (f1_ws) return;

	console.log("F1: setting up socket");

	const hub = encodeURIComponent(JSON.stringify([{ name: "Streaming" }]));
	const { body, cookie } = await negotiate(hub);

	const token = encodeURIComponent(body.ConnectionToken);
	const url = `${config.f1BaseUrl}/connect?clientProtocol=1.5&transport=webSockets&connectionToken=${token}&connectionData=${hub}`;

	console.log("F1: connecting!");

	f1_ws = new WebSocket(url, {
		headers: {
			"User-Agent": "BestHTTP",
			"Accept-Encoding": "gzip,identity",
			Cookie: cookie,
		},
	});

	f1_ws.onmessage = (rawData) => {
		if (typeof rawData.data !== "string") return;
		const data = JSON.parse(rawData.data);

		state = updateState(state, data);

		wss.publish("f1-socket", JSON.stringify(translate(state)));
	};

	f1_ws.onopen = () => f1_ws?.send(subscribeRequest());

	f1_ws.onerror = () => {
		console.log("F1: got error");
		console.log("F1: closing socket");
		f1_ws?.close();
	};

	f1_ws.onclose = () => {
		console.log("F1: got close");
		console.log("F1: killing socket");
		f1_ws = null;

		retrySetup(wss);
	};

	if (!f1_ws || f1_ws.readyState === 3) {
		console.log("F1: failed to setup socket");
		retrySetup(wss);
	}
};

const retrySetup = async (wss: Server) => {
	if (!active) return;
	console.log("F1: retrying to setup in 1s");

	await sleep(1000);
	setupF1(wss);
};

const negotiate = async (hub: string) => {
	const url = `${config.f1NegotiateUrl}/negotiate?connectionData=${hub}&clientProtocol=1.5`;
	const res = await fetch(url);

	const body: NegotiateResult = await res.json();

	return {
		body,
		cookie: res.headers.get("Set-Cookie") ?? res.headers.get("set-cookie") ?? "",
	};
};

const subscribeRequest = (): string => {
	console.log("F1: sent subscribe request");
	return JSON.stringify({
		H: "Streaming",
		M: "Subscribe",
		A: [
			[
				"Heartbeat",
				"CarData.z",
				"Position.z",
				"ExtrapolatedClock",
				"TopThree",
				// "RcmSeries", // still used?
				"TimingStats",
				"TimingAppData",
				"WeatherData",
				"TrackStatus",
				"DriverList",
				"RaceControlMessages",
				"SessionInfo",
				"SessionData",
				"LapCount",
				"TimingData",
				"TeamRadio",
			],
		],
		I: 1,
	});
};

console.log("listening on port:", config.port);
