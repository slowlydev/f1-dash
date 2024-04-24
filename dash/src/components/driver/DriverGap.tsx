import clsx from "clsx";
import { TimingDataDriver } from "@/types/state.type";

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
		<div className="place-self-start text-lg font-semibold" id="walkthrough-driver-gap">
			<p
				className={clsx("leading-none", {
					"text-emerald-500": catching,
					"text-zinc-600": !gapToFront,
				})}
			>
				{!!gapToFront ? gapToFront : "-- ---"}
			</p>
			<p className="text-sm font-medium leading-none text-zinc-600">{!!gapToLeader ? gapToLeader : "-- ---"}</p>
		</div>
	);
}
