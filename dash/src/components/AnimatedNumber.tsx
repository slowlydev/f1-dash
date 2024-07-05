"use client";

import { useEffect, useState } from "react";
import { animate } from "framer-motion";

type Props = {
	children: number;
	fixed?: number;
	className?: string;
};

export default function AnimatedNumber({ className, fixed = 0, children: value }: Props) {
	const [v, setV] = useState<number>(() => value);

	useEffect(() => {
		animate(v, value, {
			duration: 0.5,
			ease: "easeOut",
			onUpdate: (v) => setV(v),
		});
	}, [value]);

	return <p className={className}>{v.toFixed(fixed)}</p>;
}
