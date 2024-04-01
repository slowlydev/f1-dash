type PosObject = {
	sectors: {
		segments: { status: number }[];
	}[];
};

export const sortQuali = (a: PosObject, b: PosObject) => {
	const aPassed = a.sectors.flatMap((sector) => sector.segments).filter((s) => s.status > 0);
	const bPassed = b.sectors.flatMap((sector) => sector.segments).filter((s) => s.status > 0);

	return bPassed.length - aPassed.length;
};
