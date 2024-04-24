import { TimingAppDataDriver, TimingDataDriver } from "@/types/state.type";

type Props = {
	timingDriver: TimingDataDriver;
};

export default function DriverInfo({ timingDriver }: Props) {
	const status = timingDriver.knockedOut
		? "OUT"
		: !!timingDriver.cutoff
			? "CUTOFF"
			: timingDriver.retired
				? "RETIRED"
				: timingDriver.stopped
					? "STOPPED"
					: timingDriver.inPit
						? "PIT"
						: timingDriver.pitOut
							? "PIT OUT"
							: null;

	return (
		<div className="place-self-start text-lg font-semibold" id="walkthrough-driver-info">
			<p className="leading-none">L {timingDriver.numberOfLaps ?? 0}</p>
			<p className="text-sm font-medium leading-none text-zinc-600">{status ?? "-"}</p>
		</div>
	);
}
