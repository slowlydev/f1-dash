import { FlagType } from "@/types/map.type";

type StatusMessage = {
	message: string;
	flagType: FlagType;
	bySector: boolean;
	pulse?: number;
};

type MessageMap = Record<string, StatusMessage>;

type FlagStyle = {
	bg: string;
	stroke: string;
	trackHex: string;
	flagHex: string;
};

type ComputedFlagStyle = FlagStyle & { flag: FlagType };

const STYLE_BY_FLAG_TYPE: Record<FlagType, FlagStyle> = {
	GREEN: { stroke: "stroke-white", bg: "bg-emerald-500", flagHex: "#34b981", trackHex: "#fafafa" },
	YELLOW: { stroke: "stroke-yellow-500", bg: "bg-yellow-500", flagHex: "#f59e0c", trackHex: "#f59e0c" },
	RED: { stroke: "stroke-red-500", bg: "bg-red-500", flagHex: "#ef4444", trackHex: "#ef4444" },
};

const MESSAGE_MAP: MessageMap = {
	1: { message: "Track Clear", flagType: "GREEN", bySector: false },
	2: {
		message: "Yellow Flag",
		flagType: "YELLOW",
		bySector: true,
	},
	3: { message: "Flag", flagType: "YELLOW", bySector: true },
	4: { message: "Safety Car", flagType: "YELLOW", bySector: false },
	5: { message: "Red Flag", flagType: "RED", bySector: false },
	6: { message: "VSC Deployed", flagType: "YELLOW", bySector: false },
	7: { message: "VSC Ending", flagType: "YELLOW", bySector: false },
};

export const getTrackStatusMessage = (statusCode: number | undefined): StatusMessage | null => {
	if (!statusCode) return null;
	return MESSAGE_MAP[statusCode] ?? MESSAGE_MAP[0];
};

export function getTrackColorStroke(flag: FlagType) {
	return STYLE_BY_FLAG_TYPE[flag].stroke;
}

export function getTrackColorBg(flag: FlagType) {
	return STYLE_BY_FLAG_TYPE[flag].bg;
}

export function getTrackColorHex(flag: FlagType) {
	return STYLE_BY_FLAG_TYPE[flag].trackHex;
}

export function getTrackColorFlagHex(flag: FlagType) {
	return STYLE_BY_FLAG_TYPE[flag].flagHex;
}

export function getComputedFlagStyle(flag: FlagType): ComputedFlagStyle {
	return {
		...STYLE_BY_FLAG_TYPE[flag],
		flag,
	};
}
