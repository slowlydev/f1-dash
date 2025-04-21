import clsx from "clsx";

import type { TimingDataDriver } from "@/types/state.type";

type Props = {
	timingDriver: TimingDataDriver;
	sessionPart: number | undefined;
};

export default function DriverGap({ timingDriver, sessionPart }: Props) {
	const gapToLeader =
		timingDriver.gapToLeader ??
		(timingDriver.stats ? timingDriver.stats[sessionPart ? sessionPart - 1 : 0].timeDiffToFastest : undefined) ??
		timingDriver.timeDiffToFastest ??
		"";

	const gapToFront =
		timingDriver.intervalToPositionAhead?.value ??
		(timingDriver.stats ? timingDriver.stats[sessionPart ? sessionPart - 1 : 0].timeDifftoPositionAhead : undefined) ??
		timingDriver.timeDiffToPositionAhead ??
		"";

	const catching = timingDriver.intervalToPositionAhead?.catching;

	return (
		<div className="place-self-start">
			<p
				className={clsx("text-lg leading-none font-medium tabular-nums", {
					"text-emerald-500": catching,
					"text-zinc-500": !gapToFront,
				})}
			>
				{!!gapToFront ? gapToFront : "-- ---"}
			</p>

			<p className="text-sm leading-none text-zinc-500 tabular-nums">{!!gapToLeader ? gapToLeader : "-- ---"}</p>
		</div>
	);
}
