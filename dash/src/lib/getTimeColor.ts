export const getTimeColor = (fastest: boolean, pb: boolean) => {
	if (fastest) return "text-purple-700";
	else if (pb) return "text-emerald-500";
	return "";
};
