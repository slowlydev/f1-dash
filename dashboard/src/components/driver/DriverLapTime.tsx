import clsx from "clsx";

import type { TimingDataDriver } from "@/types/state.type";

type Props = {
	last: TimingDataDriver["LastLapTime"];
	best: TimingDataDriver["BestLapTime"];
	hasFastest: boolean;
};

export default function DriverLapTime({ last, best, hasFastest }: Props) {
	return (
		<div className="place-self-start">
			<p
				className={clsx("text-lg leading-none font-medium tabular-nums", {
					"text-violet-600!": last.OverallFastest,
					"text-emerald-500!": last.PersonalFastest,
					"text-zinc-500!": !last.Value,
				})}
			>
				{!!last.Value ? last.Value : "-- -- ---"}
			</p>
			<p
				className={clsx("text-sm leading-none text-zinc-500 tabular-nums", {
					"text-violet-600!": hasFastest,
					"text-zinc-500!": !best.Value,
				})}
			>
				{!!best.Value ? best.Value : "-- -- ---"}
			</p>
		</div>
	);
}
