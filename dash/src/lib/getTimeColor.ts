export const getTimeColor = (fastest: boolean, pb: boolean) => {
	if (fastest) return "text-indigo-500";
	else if (pb) return "text-emerald-500";
	return "";
};

export const getSectorColor = (type: "bg" | "text", fastest: boolean, pb: boolean) => {
	if (fastest) return `${type}-indigo-500`;
	else if (pb) return `${type}-emerald-500`;
	return `${type}-yellow-500`;
};
