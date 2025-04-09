import clsx from "clsx";

import type { Driver } from "@/types/state.type";

type Props = {
	driver: Driver;
	position?: number;
	className?: string;
	statusTooltip?: string;
};

export default function DriverTag({ driver, position, className, statusTooltip }: Props) {
	const teamColor = driver.teamColour;
	const short = driver.tla;
	return (
		<div
			id="walkthrough-driver-position"
			className={clsx(
				"flex w-fit items-center justify-between gap-0.5 rounded-lg bg-zinc-600 px-1 py-1 font-black",
				className,
			)}
			style={{ backgroundColor: `#${teamColor}` }}
			data-tooltip-id="tooltip"
			data-tooltip-content={statusTooltip}
		>
			{position && <p className="px-1 text-xl leading-none">{position}</p>}

			<div
				className="flex h-min w-min items-center justify-center rounded-md bg-white px-1"
				data-tooltip-id="tooltip"
				data-tooltip-content={`${driver.fullName} #${driver.racingNumber}`}
			>
				<p className="font-mono text-zinc-600" style={{ ...(teamColor && { color: `#${teamColor}` }) }}>
					{short}
				</p>
			</div>
		</div>
	);
}
