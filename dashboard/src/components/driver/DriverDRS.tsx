import clsx from "clsx";

type Props = {
	on: boolean;
	possible: boolean;
	inPit: boolean;
	pitOut: boolean;
};

export default function DriverDRS({ on, possible, inPit, pitOut }: Props) {
	const pit = inPit || pitOut;
	const label = pit ? "PIT" : "OVTK";
	const fullLabel = pit ? "PIT" : "OVERTAKE";

	return (
		<span
			title={fullLabel}
			aria-label={fullLabel}
			className={clsx(
				"inline-flex h-8 w-full items-center justify-center rounded-md border-2 font-mono text-xs leading-none font-black tracking-tight sm:text-sm",
				{
					"border-zinc-700 text-zinc-700": !pit && !on && !possible,
					"border-zinc-400 text-zinc-400": !pit && !on && possible,
					"border-emerald-500 text-emerald-500": !pit && on,
					"border-cyan-500 text-cyan-500": pit,
				},
			)}
		>
			{label}
		</span>
	);
}
