"use client";

type Props = {
	value: number;
	setValue: (value: number) => void;
};

export default function Slider({ value, setValue }: Props) {
	return (
		<input
			type="range"
			value={value}
			className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-700 accent-indigo-500"
			onChange={(e) => setValue(Number(e.target.value))}
		/>
	);
}
