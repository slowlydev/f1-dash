import { AnimatePresence } from "framer-motion";
import clsx from "clsx";

import { useDataStore } from "@/stores/useDataStore";

import { sortUtc } from "@/lib/sorting";

import { RaceControlMessage } from "@/components/RaceControlMessage";

export default function RaceControl() {
	const messages = useDataStore((state) => state.raceControlMessages);
	const gmtOffset = useDataStore((state) => state.sessionInfo?.gmtOffset);

	return (
		<ul className="flex flex-col">
			{!messages &&
				new Array(7).fill("").map((_, index) => <SkeletonMessage key={`msg.loading.${index}`} index={index} />)}

			{messages && gmtOffset && (
				<AnimatePresence>
					{messages.messages
						.sort(sortUtc)
						.filter((msg) => (msg.flag ? msg.flag.toLowerCase() !== "blue" : true))
						.map((msg, i) => (
							<RaceControlMessage key={`msg.${i}`} msg={msg} gmtOffset={gmtOffset} />
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
