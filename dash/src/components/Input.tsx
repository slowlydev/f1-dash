"use client";

import clsx from "clsx";

type Props = {
	value: number;
	setValue: (value: number) => void;
};

export default function Input({ value, setValue }: Props) {
	const handleChange = (value: string) => {
		if (value === "") {
			setValue(0);
		} else {
			const numericValue = Number(value);
			if (!isNaN(numericValue)) {
				setValue(numericValue);
			}
		}
	};

	return (
		<input
			className={clsx(
				"w-12 rounded-lg bg-zinc-800 p-1 text-center text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
			)}
			type="number"
			max={100}
			placeholder="50"
			value={value}
			onChange={(e) => handleChange(e.target.value)}
		/>
	);
}
