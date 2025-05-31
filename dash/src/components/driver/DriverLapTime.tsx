import clsx from "clsx";

import type { TimingDataDriver } from "@/types/state.type";

type Props = {
	last: TimingDataDriver["lastLapTime"];
	best: TimingDataDriver["bestLapTime"];
	hasFastest: boolean;
};

export default function DriverLapTime({ last, best, hasFastest }: Props) {
	return (
		<div className="place-self-start">
			<p
				className={clsx("text-lg leading-none font-medium tabular-nums", {
					"text-violet-600!": last.overallFastest,
					"text-emerald-500!": last.personalFastest,
					"text-zinc-500!": !last.value,
				})}
			>
				{!!last.value ? last.value : "-- -- ---"}
			</p>
			<p
				className={clsx("text-sm leading-none text-zinc-500 tabular-nums", {
					"text-violet-600!": hasFastest,
					"text-zinc-500!": !best.value,
				})}
			>
				{!!best.value ? best.value : "-- -- ---"}
			</p>
		</div>
	);
}
