import clsx from "clsx";

import { getTimeColor } from "@/lib/getTimeColor";
import { TimingDataDriver } from "@/types/state.type";

type Props = {
	last: TimingDataDriver["lastLapTime"];
	best: TimingDataDriver["bestLapTime"];
};

export default function DriverLapTime({ last, best }: Props) {
	return (
		<div className="place-self-start">
			<p
				className={clsx(
					"text-sm font-medium leading-none text-gray-500",
					getTimeColor(best.position == 1, true),
					!best.value ? "text-gray-500" : "",
				)}
			>
				{!!best.value ? best.value : "-- -- ---"}
			</p>
			<p
				className={clsx(
					"text-lg font-semibold leading-none",
					getTimeColor(last.overallFastest, last.personalFastest),
					!last.value ? "text-gray-500" : "",
				)}
			>
				{!!last.value ? last.value : "-- -- ---"}
			</p>
		</div>
	);
}
