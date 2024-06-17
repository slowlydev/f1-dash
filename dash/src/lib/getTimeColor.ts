export const getTimeColor = (fastest: boolean, pb: boolean) => {
	if (fastest) return "text-violet-600";
	else if (pb) return "text-emerald-500";
	return "";
};

export const getSectorColorBG = (fastest: boolean, pb: boolean) => {
	if (fastest) return "bg-violet-500";
	else if (pb) return "bg-emerald-500";
	return "bg-yellow-500";
};

export const getSectorColorText = (fastest: boolean, pb: boolean) => {
	if (fastest) return "text-violet-500";
	else if (pb) return "text-emerald-500";
	return "text-yellow-500";
};
