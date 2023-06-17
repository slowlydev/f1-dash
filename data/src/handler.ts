import { inflateSync } from "bun";
import { merge } from "lodash";

import { F1CarData, ParsedRecap, F1Position, SocketData, F1State } from "./formula1.type";

const parseCompressed = <T>(data: string): T => {
	return JSON.parse(new TextDecoder().decode(inflateSync(Buffer.from(data, "base64"))));
};

export const updateState = (state: F1State, data: SocketData): F1State => {
	if (data.M) {
		for (const message of data.M) {
			if (message.M !== "feed") continue;

			let [cat, msg] = message.A;

			console.log("update: ", cat);

			let parsedMsg: null | F1CarData | F1Position = null;
			let parsedCat: null | string = null;

			if ((cat === "CarData.z" || cat === "Position.z") && typeof msg === "string") {
				parsedCat = cat.split(".")[0];
				parsedMsg = parseCompressed<F1CarData | F1Position>(msg);
			}

			return merge(state, { [parsedCat ?? cat]: parsedMsg ?? msg }) ?? state;
		}
	}

	if (data.R && data.I === "1") {
		const parsedData: ParsedRecap = {
			...(data.R["CarData.z"] && { CarData: parseCompressed(data.R["CarData.z"]) }),
			...(data.R["Position.z"] && { Position: parseCompressed(data.R["Position.z"]) }),
		};

		const { "CarData.z": z1, "Position.z": z2, ...newState } = { ...data.R, ...parsedData };

		return merge(state, newState) ?? state;
	}

	return state;
};
