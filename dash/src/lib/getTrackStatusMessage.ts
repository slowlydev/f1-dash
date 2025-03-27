import { TrackColor } from "@/types/map.type";

type StatusMessage = {
	message: string;
	trackColor: TrackColor;
	bySector: boolean;
	pulse?: number;
};

type MessageMap = {
	[key: string]: StatusMessage;
};

type ComputedTrackStyle = {
	trackColor: TrackColor;
	bg: string;
	stroke: string;
	trackHex: string;
	flagHex: string;
};

const STROKE_BY_TRACK_COLOR: Record<TrackColor, string> = {
	GREEN: "stroke-white",
	YELLOW: "stroke-yellow-500",
	RED: "stroke-red-500",
};

const BG_BY_TRACK_COLOR: Record<TrackColor, string> = {
	GREEN: "bg-emerald-500",
	YELLOW: "bg-yellow-500",
	RED: "bg-red-500",
};

const FLAG_HEX_BY_TRACK_COLOR: Record<TrackColor, string> = {
	GREEN: "#34b981",
	YELLOW: "#f59e0c",
	RED: "#ef4444",
};

const TRACK_HEX_BY_TRACK_COLOR: Record<TrackColor, string> = {
	GREEN: "#fafafa",
	YELLOW: "#f59e0c",
	RED: "#ef4444",
};

const MESSAGE_MAP: MessageMap = {
	1: { message: "Track Clear", trackColor: "GREEN", bySector: false },
	2: {
		message: "Yellow Flag",
		trackColor: "YELLOW",
		bySector: true,
	},
	3: { message: "Flag", trackColor: "YELLOW", bySector: true },
	4: { message: "Safety Car", trackColor: "YELLOW", bySector: false },
	5: { message: "Red Flag", trackColor: "RED", bySector: false },
	6: { message: "VSC Deployed", trackColor: "YELLOW", bySector: false },
	7: { message: "VSC Ending", trackColor: "YELLOW", bySector: false },
};

export const getTrackStatusMessage = (statusCode: number | undefined): StatusMessage | null => {
	if (!statusCode) return null;
	return MESSAGE_MAP[statusCode] ?? MESSAGE_MAP[0];
};

export function getTrackColorStroke(color: TrackColor) {
	return STROKE_BY_TRACK_COLOR[color];
}

export function getTrackColorBg(color: TrackColor) {
	return BG_BY_TRACK_COLOR[color];
}

export function getTrackColorHex(color: TrackColor) {
	return TRACK_HEX_BY_TRACK_COLOR[color];
}

export function getTrackColorFlagHex(color: TrackColor) {
	return FLAG_HEX_BY_TRACK_COLOR[color];
}

export function getComputedTrackStyle(color: TrackColor): ComputedTrackStyle {
	return {
		trackColor: color,
		bg: getTrackColorBg(color),
		stroke: getTrackColorStroke(color),
		trackHex: getTrackColorHex(color),
		flagHex: getTrackColorFlagHex(color),
	};
}
