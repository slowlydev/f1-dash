type PosObject = { position: string };

export const sortPos = (a: PosObject, b: PosObject) => {
	return parseInt(a.position) - parseInt(b.position);
};
