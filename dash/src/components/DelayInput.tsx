import { FormEvent, useState } from "react";

type Props = {
	setDebouncedDelay: (delay: number) => void;
	maxDelay: number;
};

export default function DelayInput({ setDebouncedDelay, maxDelay }: Props) {
	const [delay, setDelay] = useState("");

	const updateDebounced = () => {
		const nextDelay = delay ? parseInt(delay) : 0;
		if (nextDelay < 0) return;
		setDebouncedDelay(nextDelay);
	};

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault();
		updateDebounced();
	};

	return (
		<div className="flex min-w-[5rem] gap-2 rounded-lg border-[1px] border-gray-500 bg-zinc-900 px-2 py-1 text-center font-mono">
			<form onSubmit={handleSubmit} className="w-min">
				<input
					value={delay}
					onChange={(e) => setDelay(e.target.value)}
					onBlur={() => updateDebounced()}
					placeholder="0s delay"
					className="w-20 bg-zinc-900 !text-gray-500"
				/>
			</form>

			<p className="text-gray-300">max {maxDelay}s</p>
		</div>
	);
}
