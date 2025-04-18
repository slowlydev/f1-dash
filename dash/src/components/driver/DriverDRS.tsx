import clsx from "clsx";

type Props = {
	on: boolean;
	possible: boolean;
	inPit: boolean;
	pitOut: boolean;
};

export default function DriverDRS({ on, possible, inPit, pitOut }: Props) {
	const pit = inPit || pitOut;

	let tooltip = null;
	let colors = null;
	if (inPit) {
		tooltip = "In Pit Lane";
		colors = "border-cyan-500 text-cyan-500";
	} else if (pitOut) {
		tooltip = "Leaving Pit Lane";
		colors = "border-cyan-500 text-cyan-500";
	} else if (on) {
		tooltip = "DRS is active";
		colors = "border-emerald-500 text-emerald-500";
	} else if (possible) {
		tooltip = "Possible: got DRS in next zone";
		colors = "border-zinc-400 text-zinc-400";
	} else {
		tooltip = "No DRS";
		colors = "border-zinc-700 text-zinc-700";
	}

	return (
		<span
			id="walkthrough-driver-drs"
			className={clsx(
				"text-md inline-flex h-8 w-full items-center justify-center rounded-md border-2 font-mono font-black",
				colors,
			)}
			data-tooltip-id="tooltip"
			data-tooltip-content={tooltip}
		>
			{pit ? "PIT" : "DRS"}
		</span>
	);
}
