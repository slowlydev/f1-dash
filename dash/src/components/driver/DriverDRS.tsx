import clsx from "clsx";

type Props = {
	on: boolean;
	possible: boolean;
	inPit: boolean;
	pitOut: boolean;
};

export default function DriverDRS({ on, possible, inPit, pitOut }: Props) {
	const pit = inPit || pitOut;

	return (
		<span
			id="walkthrough-driver-drs"
			className={clsx(
				"text-md inline-flex h-8 w-full items-center justify-center rounded-md border-2 font-mono font-black",
				{
					"border-gray-500 text-gray-500": !pit && !on && !possible,
					"border-gray-300 text-gray-300": !pit && !on && possible,
					"border-emerald-500 text-emerald-500": !pit && on,
					"border-cyan-500 text-cyan-500": pit,
				},
			)}
		>
			{pit ? "PIT" : "DRS"}
		</span>
	);
}
