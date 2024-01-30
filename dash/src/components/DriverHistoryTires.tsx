import React from "react";
import Image from "next/image";

import { Stint } from "@/types/state.type";

type Props = {
	stints: Stint[];
};

export default function DriverHistoryTires({ stints }: Props) {
	const unknownCompound = (stint: Stint) =>
		!["soft", "medium", "hard", "intermediate", "wet"].includes(stint.compound ?? "");

	return (
		<div className="flex flex-row items-center justify-start gap-1">
			{stints.map((stint, i) => (
				<div className="flex flex-col items-center gap-1">
					{unknownCompound(stint) && (
						<div className="flex h-8 w-8 items-center justify-center">
							<p>?</p>
						</div>
					)}
					{!unknownCompound(stint) && (
						<Image src={`/tires/${stint.compound.toLowerCase()}.svg`} width={32} height={32} alt={stint.compound} />
					)}

					<p className="text-sm font-bold leading-none text-zinc-600">{stint.laps} L</p>
				</div>
			))}

			{stints.length < 1 && (
				<>
					<LoadingTire />
					<LoadingTire />
					<LoadingTire />
				</>
			)}
		</div>
	);
}

function LoadingTire() {
	return (
		<div className="flex flex-col items-center gap-1">
			<div className="h-8 w-8 animate-pulse rounded-full bg-gray-700" />
			<div className="h-4 w-8 animate-pulse rounded-md  bg-gray-700" />
		</div>
	);
}
