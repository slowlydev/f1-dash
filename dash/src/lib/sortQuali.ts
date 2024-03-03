type PosObject = {
	sectors: {
		segments: { status: number }[];
	}[];
};

export const sortQuali = (a: PosObject, b: PosObject) => {
	const aPassed = a.sectors[2].segments.filter((s) => s.status > 0);
	const bPassed = b.sectors[2].segments.filter((s) => s.status > 0);

	return bPassed.length - aPassed.length;
};
