"use client";

import { LayoutGroup, motion } from "framer-motion";

type Props<T> = {
	options: {
		label: string;
		value: T;
	}[];
	selected: T;
	onSelect: (val: T) => void;
};

export default function SegmentedControls<T>({ options, selected, onSelect }: Props<T>) {
	return (
		<LayoutGroup>
			<div className="m-0 inline-flex h-fit rounded-lg bg-zinc-800 p-0.5">
				{options.map((option, i) => {
					const isActive = option.value === selected;
					return (
						<motion.div
							className="relative mb-0 leading-none"
							whileTap={isActive ? { scale: 0.95 } : { opacity: 0.6 }}
							key={option.label}
						>
							<button
								onClick={() => onSelect(option.value)}
								className="relative m-0 border-none bg-transparent px-5 py-2 leading-none"
							>
								{isActive && (
									<motion.div
										layoutId="segment"
										className="absolute bottom-0 left-0 right-0 top-0 z-[1] rounded-md bg-zinc-600"
									/>
								)}
								<span className="relative z-[2]">{option.label}</span>
							</button>
						</motion.div>
					);
				})}
			</div>
		</LayoutGroup>
	);
}
