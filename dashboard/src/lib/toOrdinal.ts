export const toOrdinal = (position: number) => {
	switch (position % 10) {
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
