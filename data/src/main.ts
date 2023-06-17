import { serve } from "bun";

import { F1State, SocketData } from "./formula1.type";
import { updateState } from "./handler";
import { State } from "./models";
import { translate } from "./translators";

// const F1_BASE_URL = "wss://livetiming.formula1.com/signalr";
const F1_BASE_URL = "ws://localhost:8000"; // testing
const F1_NEGOTIATE_URL = "https://livetiming.formula1.com/signalr";

console.log("starting...");

let f1_ws: WebSocket | null;

serve({
	// fetch(req, server) {
	// 	const url = new URL(req.url);
	// 	if (url.pathname === "/") {
	// 		const upgraded = server.upgrade(req);
	// 		if (!upgraded) {
	// 			return new Response("Upgrade failed", { status: 400 });
	// 		}
	// 	}
	// 	return new Response("Hello World");
	// },
	fetch(req, server) {
		if (server.upgrade(req)) return;
		return new Response("Upgrade failed :(", { status: 500 });
	},
	port: 4000,
	websocket: {
		async open(ws) {
			console.log("connected!");

			const hub = encodeURIComponent(JSON.stringify([{ name: "Streaming" }]));
			const body = await negotiate(hub);

			const token = encodeURIComponent(body.ConnectionToken);
			const url = `${F1_BASE_URL}/connect?clientProtocol=1.5&transport=webSockets&connectionToken=${token}&connectionData=${hub}`;
			f1_ws = new WebSocket(url);

			let state: F1State = {};

			f1_ws.onopen = () => f1_ws?.send(subscribeRequest());

			f1_ws.onmessage = (rawData) => {
				if (typeof rawData.data !== "string") return;
				const data: SocketData = JSON.parse(rawData.data);

				// if (!data.M || !data.R) return;

				console.log("update...");

				state = updateState(state, data);

				ws.send(JSON.stringify(translate(state)));
			};
		},
		message(ws, message) {
			console.log(message);
		},
		close() {
			f1_ws?.close();
			console.log("disconnected!");
		},
	}, // handlers
});

const negotiate = async (hub: string): Promise<NegotiateResult> => {
	const url = `${F1_NEGOTIATE_URL}/negotiate?connectionData=${hub}&clientProtocol=1.5`;
	const res = await fetch(url);
	return await res.json();
};

const subscribeRequest = (): string => {
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
				"RcmSeries", // still used?
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

console.log("running...");
