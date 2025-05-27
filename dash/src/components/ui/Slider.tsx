"use client";

import clsx from "clsx";

type Props = {
	className?: string;
	value: number;
	setValue: (value: number) => void;
};

export default function Slider({ value, setValue, className }: Props) {
	return (
		<input
			type="range"
			value={value}
			className={clsx("h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-800", className)}
			onChange={(e) => setValue(Number(e.target.value))}
		/>
	);
}
