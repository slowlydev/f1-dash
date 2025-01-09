"use client";

import { ChangeEvent } from "react";

type Props = {
	value: number;
	setValue: (value: number) => void;
};

export default function Slider({ value, setValue }: Props) {
	function handleChange(event: ChangeEvent<HTMLInputElement>) {
		setValue(Number(event.target.value));
	}
	return (
			<input
				type="range"
				value={value}
				className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-700 accent-indigo-500"
				onChange={handleChange}
			></input>
	);
}
		