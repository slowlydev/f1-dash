"use client";

import clsx from "clsx";

type Props = {
	value: string;
	setValue: (value: string) => void;
};

export default function Input({ value, setValue }: Props) {
	return (
		<input
			className={clsx(
				"w-12 rounded-lg bg-zinc-800 p-1 text-center text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
			)}
			type="text"
			value={value}
			onChange={(e) => setValue(e.target.value)}
		/>
	);
}
