import { inflateRaw } from "pako";

export const inflate = <T>(data: string): T => {
	const binaryString = atob(data);

	const len = binaryString.length;

	const bytes = new Uint8Array(len);

	for (let i = 0; i < len; i++) {
		bytes[i] = binaryString.charCodeAt(i);
	}

	const inflatedData = inflateRaw(bytes, { to: "string" });

	return JSON.parse(inflatedData);
};
