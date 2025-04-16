import { useEffect, useState } from "react";

import { animate } from "motion";

export const useAnimatedNumber = (value: number) => {
	const [v, setV] = useState<number>(() => value);

	useEffect(() => {
		animate(v, value, {
			duration: 0.5,
			ease: "easeOut",
			onUpdate: (v) => setV(v),
		});
	}, [value]);

	return v;
};
