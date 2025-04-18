import Image from "next/image";

import { Stint } from "@/types/state.type";

type Props = {
	stints: Stint[] | undefined;
};

export default function DriverTire({ stints }: Props) {
	const stops = stints ? stints.length - 1 : 0;
	const currentStint = stints ? stints[stints.length - 1] : null;
	const compound = currentStint?.compound;
	const unknownCompound = !["soft", "medium", "hard", "intermediate", "wet"].includes(compound?.toLowerCase() ?? "");

	return (
		<div className="flex flex-row items-center gap-2 place-self-start" id="walkthrough-driver-tire">
			{currentStint && !unknownCompound && compound && (
				<Image
					src={"/tires/" + compound.toLowerCase() + ".svg"}
					width={32}
					height={32}
					alt={compound}
					data-tooltip-id="tooltip"
					data-tooltip-content={compound[0] + compound.slice(1).toLowerCase() + " tires"}
				/>
			)}

			{currentStint && unknownCompound && (
				<div className="flex h-8 w-8 items-center justify-center">
					<Image
						src={"/tires/unknown.svg"}
						width={32}
						height={32}
						alt={"unknown"}
						data-tooltip-id="tooltip"
						data-tooltip-content="Unknown tires"
					/>
				</div>
			)}

			{!currentStint && <div className="h-8 w-8 animate-pulse rounded-full bg-zinc-800 font-semibold" />}

			<div>
				<p
					className="font-bold leading-none"
					data-tooltip-id="tooltip"
					data-tooltip-content={"Tire age" + (currentStint?.new ? "" : " (old)")}
				>
					L {currentStint?.totalLaps ?? 0}
					{currentStint?.new ? "" : "*"}
				</p>
				<p
					className="text-sm font-medium leading-none text-zinc-600"
					data-tooltip-id="tooltip"
					data-tooltip-content="# pit stops"
				>
					PIT {stops}
				</p>
			</div>
		</div>
	);
}
