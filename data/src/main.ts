import { type Server, serve } from "bun";

import { type F1State } from "./formula1.type";
import { updateState } from "./handler";
import { translate } from "./translators";

const F1_NEGOTIATE_URL = "https://livetiming.formula1.com/signalr";
const DEFAULT_F1_BASE_URL = "wss://livetiming.formula1.com/signalr";
const F1_BASE_URL = process.env.F1_BASE_URL ?? DEFAULT_F1_BASE_URL;

console.log("starting...");

let f1_ws: WebSocket | null;
let state: F1State = {};

const server = serve({
	fetch(req, server) {
		if (req.url.includes("/api/ping")) return new Response(null, { status: 200 });
		if (server.upgrade(req)) return;
		return new Response("Upgrade failed :(", { status: 500 });
	},
	port: process.env.PORT ?? 4000,
	websocket: {
		async open(ws) {
			console.log("WS: got connection");
			console.log("WS: subscribing to state updates");
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
			console.log("WS: unsubscribe to state updates");

			ws.unsubscribe("f1-socket");
		},
	},
});

const setupF1 = async (wss: Server) => {
	if (f1_ws) return;

	console.log("F1: setting up socket");

	const hub = encodeURIComponent(JSON.stringify([{ name: "Streaming" }]));
	const { body, cookie } = await negotiate(hub);

	const token = encodeURIComponent(body.ConnectionToken);
	const url = `${F1_BASE_URL}/connect?clientProtocol=1.5&transport=webSockets&connectionToken=${token}&connectionData=${hub}`;

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

const retrySetup = (wss: Server) => {
	setTimeout(async () => {
		console.log("F1: retrying to setup");
		await setupF1(wss);
	}, 1000);
};

const negotiate = async (hub: string) => {
	const url = `${F1_NEGOTIATE_URL}/negotiate?connectionData=${hub}&clientProtocol=1.5`;
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

console.log("listening on port:", process.env.PORT ?? 4000);
