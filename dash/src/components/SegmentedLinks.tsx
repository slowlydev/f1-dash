"use client";

import clsx from "clsx";
import { LayoutGroup, motion } from "framer-motion";
import Link from "next/link";

type Props = {
	id?: string;
	className?: string;
	options: {
		label: string;
		href: string;
	}[];
	selected: string;
	onSelect?: (val: string) => void;
};

export default function SegmentedLinks<T>({ id, className, options, selected, onSelect }: Props) {
	return (
		<LayoutGroup>
			<div
				id={id}
				className={clsx("m-0 inline-flex h-fit justify-between rounded-lg bg-zinc-800 px-0.5 py-[0.7rem]", className)}
			>
				{options.map((option, i) => {
					const isActive = option.href === selected;
					return (
						<motion.div
							className="relative mb-0 leading-none"
							whileTap={isActive ? { scale: 0.95 } : { opacity: 0.6 }}
							key={option.label}
						>
							<Link href={option.href} className="relative m-0 border-none bg-transparent px-5 py-2 leading-none">
								{isActive && (
									<motion.div
										layoutId={`segment-${id}`}
										className="absolute bottom-0 left-0 right-0 top-0 z-[1] rounded-md bg-zinc-600"
									/>
								)}
								<span className="relative z-[2]">{option.label}</span>
							</Link>
						</motion.div>
					);
				})}
			</div>
		</LayoutGroup>
	);
}
