export const getTimeColor = (fastest: boolean, pb: boolean) => {
	if (fastest) return "text-violet-600";
	else if (pb) return "text-emerald-500";
	return "";
};
