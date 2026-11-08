// lap and sector values are "19.638", or "1:02.345" when over a minute
export const toMillis = (value: string | undefined): number | null => {
	if (!value) return null;

	const parts = value.split(":").map(Number);
	const seconds = parts.pop();
	const minutes = parts.pop() ?? 0;

	if (seconds === undefined || !Number.isFinite(seconds) || !Number.isFinite(minutes)) return null;

	return minutes * 60_000 + Math.round(seconds * 1000);
};
