import { AnimatePresence } from "framer-motion";
import clsx from "clsx";

import { sortUtc } from "@/lib/sorting/sortUtc";

import { RaceControlMessage } from "@/components/RaceControlMessage";

import { RaceControlMessages } from "@/types/state.type";

type Props = {
	messages: RaceControlMessages | undefined;
	utcOffset: string;
};

export default function RaceControl({ messages, utcOffset }: Props) {
	return (
		<ul className="flex flex-col gap-2">
			{!messages &&
				new Array(7).fill("").map((_, index) => <SkeletonMessage key={`msg.loading.${index}`} index={index} />)}

			{messages && (
				<AnimatePresence>
					{messages.messages
						.sort(sortUtc)
						.filter((msg) => (msg.flag ? msg.flag.toLowerCase() !== "blue" : true))
						.map((msg, i) => (
							<RaceControlMessage key={`msg.${i}`} msg={msg} utcOffset={utcOffset} />
						))}
				</AnimatePresence>
			)}
		</ul>
	);
}

const SkeletonMessage = ({ index }: { index: number }) => {
	const animateClass = "h-6 animate-pulse rounded-md bg-zinc-800";

	const flag = index % 4 === 0;
	const long = index % 5 === 0;
	const mid = index % 3 === 0;

	return (
		<li className="flex flex-col gap-1">
			<div className={clsx(animateClass, "!h-4 w-16")} />

			<div className="flex gap-1">
				{flag && <div className={clsx(animateClass, "w-6")} />}
				<div className={animateClass} style={{ width: long ? "100%" : mid ? "75%" : "40%" }} />
			</div>
		</li>
	);
};
