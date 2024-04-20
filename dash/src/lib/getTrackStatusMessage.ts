type StatusMessage = {
	message: string;
	color: string;
	trackColor: string;
	bySector?: boolean;
	pulse?: number;
	hex: string;
};

type MessageMap = {
	[key: string]: StatusMessage;
};

export const getTrackStatusMessage = (statusCode: number | undefined): StatusMessage | null => {
	const messageMap: MessageMap = {
		1: { message: "Track Clear", color: "bg-emerald-500", trackColor: "stroke-white", hex: "#34b981" },
		2: {
			message: "Yellow Flag",
			color: "bg-yellow-500",
			trackColor: "stroke-yellow-500",
			bySector: true,
			hex: "#f59e0c",
		},
		3: { message: "Flag", color: "bg-yellow-500", trackColor: "stroke-yellow-500", bySector: true, hex: "#f59e0c" },
		4: { message: "Safety Car", color: "bg-yellow-500", trackColor: "stroke-yellow-500", hex: "#f59e0c" },
		5: { message: "Red Flag", color: "bg-red-500", trackColor: "stroke-red-500", hex: "#ef4444" },
		6: { message: "VSC Deployed", color: "bg-yellow-500", trackColor: "stroke-yellow-500", hex: "#f59e0c" },
		7: { message: "VSC Ending", color: "bg-yellow-500", trackColor: "stroke-yellow-500", hex: "#f59e0c" },
	};

	return statusCode ? messageMap[statusCode] ?? messageMap[0] : null;
};
