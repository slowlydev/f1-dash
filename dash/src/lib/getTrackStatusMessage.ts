type StatusMessage = {
	message: string;
	color: string;
	trackColor: string;
	bySector?: boolean;
	pulse?: number;
};

type MessageMap = {
	[key: string]: StatusMessage;
};

export const getTrackStatusMessage = (statusCode: number | undefined): StatusMessage | null => {
	const messageMap: MessageMap = {
		1: { message: "Track Clear", color: "bg-emerald-500", trackColor: "stroke-white" },
		2: { message: "Yellow Flag", color: "bg-yellow-500", trackColor: "stroke-yellow-300", bySector: true },
		3: { message: "Flag", color: "bg-yellow-500", trackColor: "stroke-yellow-300", bySector: true },
		4: { message: "Safety Car", color: "bg-yellow-500", trackColor: "stroke-yellow-300" },
		5: { message: "Red Flag", color: "bg-red-500", trackColor: "stroke-red-500" },
		6: { message: "VSC Deployed", color: "bg-yellow-500", trackColor: "stroke-yellow-300" },
		7: { message: "VSC Ending", color: "bg-yellow-500", trackColor: "stroke-yellow-300" },
	};

	return statusCode ? messageMap[statusCode] ?? messageMap[0] : null;
};
