import { inflateRaw } from "pako";

export const inflate = <T>(data: string): T => {
	return JSON.parse(
		inflateRaw(
			Uint8Array.from(atob(data), (c) => c.charCodeAt(0)),
			{ to: "string" },
		),
	);
};
