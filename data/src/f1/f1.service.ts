import { config } from "lib/config";
import { emit, emitter, subscribe } from "lib/event";
import { error, info } from "lib/logger";
import { updateState } from "./f1.handler";
import { translate } from "./f1.translator";
import { F1State } from "./f1.type";

const channel = "f1-data";
let state: F1State = {};
let socket: WebSocket | null = null;

type Negotiation = { token: string; cookie: string | null };
const negotiate = async (): Promise<Negotiation | null> => {
	info("negotiating...");
	if (config.f1BaseUrl.includes("localhost")) return { token: "", cookie: null };
	const params = new URLSearchParams({
		clientProtocol: "1.5",
		connectionData: JSON.stringify([{ name: "Streaming" }]),
	}).toString();
	const url = `https://${config.f1BaseUrl}/signalr/negotiate?${params}`;
	const response = await fetch(url);
	if (response.ok) {
		const data = (await response.json()) as { ConnectionToken: string };
		return { token: data.ConnectionToken, cookie: response.headers.get("set-cookie") };
	}
	error(`failed to negotiate - status ${response.status} ${response.statusText}`);
	return null;
};

const connect = (negotiation: Negotiation): Promise<WebSocket | null> => {
	return new Promise((resolve) => {
		info("connecting socket...");
		const params = new URLSearchParams({
			clientProtocol: "1.5",
			transport: "webSockets",
			connectionToken: negotiation.token,
			connectionData: JSON.stringify([{ name: "Streaming" }]),
		});
		const protocol = config.f1BaseUrl.includes("localhost") ? "ws" : "wss";
		const url = `${protocol}://${config.f1BaseUrl}/signalr/connect?${params}`;
		const socket = new WebSocket(url, {
			headers: { "accept-encoding": "gzip,identity", cookie: negotiation.cookie ?? "" },
		});
		socket.onopen = () => {
			info("sending subscribe request...");
			socket.send(
				JSON.stringify({
					H: "Streaming",
					M: "Subscribe",
					A: [
						[
							"Heartbeat",
							"CarData.z",
							"Position.z",
							"ExtrapolatedClock",
							"TopThree",
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
				}),
			);
			resolve(socket);
		};
		socket.onclose = () => {
			error("web socket got closed");
			resolve(null);
		};
		socket.onerror = (err) => {
			error("web socket encountered an error", err);
			resolve(null);
		};
	});
};

const setup = async (): Promise<void> => {
	const negotiation = await negotiate();
	if (!negotiation) return error("no data from negotiation");
	socket = await connect(negotiation);
	if (!socket) return error("failed to connect web socket");
	socket.onmessage = (event) => {
		if (typeof event.data !== "string") {
			return error("received message is not a string");
		}
		state = updateState(state, JSON.parse(event.data));
		emit(channel, translate(state));
	};
	socket.onclose = () => {
		state = {};
		socket = null;
	};
};

setInterval(async () => {
	if (emitter.listenerCount(channel) > 0 && !socket) {
		info("we got connections opening web socket");
		await setup();
	} else if (emitter.listenerCount(channel) === 0 && socket) {
		info("no connections left closing web socket");
		socket.close();
		state = {};
		socket = null;
	}
}, 2000);

export const streamData = (req: Request): Response => {
	return subscribe(req, channel, translate(state));
};

export const findConnections = (): { connections: number } => {
	return { connections: emitter.listenerCount(channel) };
};
