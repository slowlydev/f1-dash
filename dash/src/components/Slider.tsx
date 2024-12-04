"use client";

type Props = {
	value: number;
	setValue: (value: number) => void;
};

export default function Slider({ value, setValue }: Props) {
	function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
		const newValue = Number(event.target.value);
		setValue(newValue);
	}
	return (
		<>
			<input
				id="default-range"
				type="range"
				value={value}
				className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
				onChange={handleChange}
			></input>
		</>
	);
}
		