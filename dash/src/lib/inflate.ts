import { inflate } from "pako";

export const decode = <T>(data: string): T => {
	return JSON.parse(
		inflate(
			Uint8Array.from(atob(data), (c) => c.charCodeAt(0)),
			{ to: "string" },
		),
	);
};
