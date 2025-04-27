"use client";

import clsx from "clsx";
import { LayoutGroup, motion } from "motion/react";

type Props<T> = {
	id?: string;
	className?: string;
	options: {
		label: string;
		value: T;
	}[];
	selected: T;
	onSelect?: (val: T) => void;
};

export default function SegmentedControls<T>({ id, className, options, selected, onSelect }: Props<T>) {
	return (
		<LayoutGroup>
			<motion.div
				id={id}
				layoutRoot
				className={clsx("m-0 inline-flex h-fit justify-between rounded-lg bg-zinc-800 p-0.5", className)}
			>
				{options.map((option) => {
					const isActive = option.value === selected;
					return (
						<motion.div
							className="relative mb-0 leading-none"
							whileTap={isActive ? { scale: 0.95 } : { opacity: 0.6 }}
							key={option.label}
						>
							<button
								onClick={() => (onSelect ? onSelect(option.value) : void 0)}
								className="relative m-0 border-none bg-transparent px-5 py-2 leading-none"
							>
								{isActive && (
									<motion.div
										layoutDependency={isActive}
										layoutId={`segment-${id}`}
										className="absolute top-0 right-0 bottom-0 left-0 z-1 rounded-md bg-zinc-600"
									/>
								)}
								<span className="relative z-2">{option.label}</span>
							</button>
						</motion.div>
					);
				})}
			</motion.div>
		</LayoutGroup>
	);
}
