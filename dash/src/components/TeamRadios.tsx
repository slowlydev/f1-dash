import { AnimatePresence } from "framer-motion";
import { utc } from "moment";
import clsx from "clsx";

import { useDataStore } from "@/stores/useDataStore";

import { sortUtc } from "@/lib/sorting";

import TeamRadioMessage from "@/components/TeamRadioMessage";

export default function TeamRadios() {
	const drivers = useDataStore((state) => state.driverList);
	const teamRadios = useDataStore((state) => state.teamRadio);
	const sessionPath = useDataStore((state) => state.sessionInfo?.path);

	const basePath = `https://livetiming.formula1.com/static/${sessionPath}`;

	// TODO add notice that we only show 20

	return (
		<ul className="flex flex-col">
			{!teamRadios && new Array(6).fill("").map((_, index) => <SkeletonMessage key={`radio.loading.${index}`} />)}

			{teamRadios && drivers && teamRadios.captures && (
				<AnimatePresence>
					{teamRadios.captures
						.sort(sortUtc)
						.slice(0, 20)
						.map((teamRadio, i) => (
							<TeamRadioMessage
								key={`radio.${utc(teamRadio.utc).unix()}.${i}`}
								driver={drivers[teamRadio.racingNumber]}
								capture={teamRadio}
								basePath={basePath}
							/>
						))}
				</AnimatePresence>
			)}
		</ul>
	);
}

const SkeletonMessage = () => {
	const animateClass = "h-6 animate-pulse rounded-md bg-zinc-800";

	return (
		<li className="flex flex-col gap-1 p-2">
			<div className={clsx(animateClass, "!h-4 w-16")} />

			<div
				className="grid place-items-center items-center gap-4"
				style={{
					gridTemplateColumns: "2rem 20rem",
				}}
			>
				<div className="place-self-start">
					<div className={clsx(animateClass, "!h-8 w-14")} />
				</div>

				<div className="flex items-center gap-4">
					<div className={clsx(animateClass, "h-6 w-6")} />
					<div className={clsx(animateClass, "!h-2 w-60")} />
				</div>
			</div>
		</li>
	);
};
