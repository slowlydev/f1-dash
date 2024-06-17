import Image from "next/image";

import { Stint } from "@/types/state.type";

type Props = {
	stints: Stint[] | undefined;
};

export default function DriverTire({ stints }: Props) {
	const stops = stints ? stints.length - 1 : 0;
	const currentStint = stints ? stints[stints.length - 1] : null;
	const unknownCompound = !["soft", "medium", "hard", "intermediate", "wet"].includes(
		currentStint?.compound?.toLowerCase() ?? "",
	);

	return (
		<div className="flex flex-row items-center gap-2 place-self-start" id="walkthrough-driver-tire">
			{currentStint && !unknownCompound && currentStint.compound && (
				<Image
					src={"/tires/" + currentStint.compound.toLowerCase() + ".svg"}
					width={32}
					height={32}
					alt={currentStint.compound}
				/>
			)}

			{currentStint && unknownCompound && (
				<div className="flex h-8 w-8 items-center justify-center">
					<Image src={"/tires/unknown.svg"} width={32} height={32} alt={"unknown"} />
				</div>
			)}

			{!currentStint && <div className="h-8 w-8 animate-pulse rounded-full bg-zinc-800 font-semibold" />}

			<div>
				<p className="font-bold leading-none">
					L {currentStint?.totalLaps ?? 0}
					{currentStint?.new ? "" : "*"}
				</p>
				<p className="text-sm font-medium leading-none text-zinc-600">PIT {stops}</p>
			</div>
		</div>
	);
}
