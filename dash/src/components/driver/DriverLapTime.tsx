import clsx from "clsx";

import { getTimeColor } from "@/lib/getTimeColor";
import { TimingDataDriver } from "@/types/state.type";

type Props = {
	last: TimingDataDriver["lastLapTime"];
	best: TimingDataDriver["bestLapTime"];
	hasFastest: boolean;
};

export default function DriverLapTime({ last, best, hasFastest }: Props) {
	return (
		<div className="place-self-start">
			<p
				className={clsx(
					"text-lg leading-none font-semibold",
					getTimeColor(last.overallFastest, last.personalFastest),
					!last.value ? "text-zinc-600" : "",
				)}
			>
				{!!last.value ? last.value : "-- -- ---"}
			</p>
			<p
				className={clsx(
					"text-sm leading-none font-medium text-zinc-600",
					getTimeColor(hasFastest, true),
					!best.value ? "text-zinc-600" : "",
				)}
			>
				{!!best.value ? best.value : "-- -- ---"}
			</p>
		</div>
	);
}
