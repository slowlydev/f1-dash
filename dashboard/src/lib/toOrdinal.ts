export const toOrdinal = (position: number) => {
	const n = position % 10;

	switch (n) {
		case 1:
			return `${position}st`;
		case 2:
			return `${position}nd`;
		case 3:
			return `${position}rd`;
		default:
			return `${position}th`;
	}
};
