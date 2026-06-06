import clsx from "clsx";

import type { TimingDataDriver } from "@/types/state.type";

type Props = {
	timingDriver: TimingDataDriver;
	gridPos?: number;
};

export default function DriverInfo({ timingDriver, gridPos }: Props) {
	const positionChange = gridPos && gridPos - parseInt(timingDriver.Position);
	const gain = positionChange && positionChange > 0;
	const loss = positionChange && positionChange < 0;

	const status = timingDriver.KnockedOut
		? "OUT"
		: !!timingDriver.Cutoff
			? "CUTOFF"
			: timingDriver.Retired
				? "RETIRED"
				: timingDriver.Stopped
					? "STOPPED"
					: timingDriver.InPit
						? "PIT"
						: timingDriver.PitOut
							? "PIT OUT"
							: null;

	return (
		<div className="place-self-start">
			<p
				className={clsx("text-lg leading-none font-medium tabular-nums", {
					"text-emerald-500": gain,
					"text-red-500": loss,
					"text-zinc-500": !gain && !loss,
				})}
			>
				{positionChange !== undefined
					? gain
						? `+${positionChange}`
						: loss
							? positionChange
							: "-"
					: `${timingDriver.NumberOfLaps}L`}
			</p>

			<p className="text-sm leading-none text-zinc-500">{status ?? "-"}</p>
		</div>
	);
}
