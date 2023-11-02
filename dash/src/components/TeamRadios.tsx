import { AnimatePresence } from "framer-motion";
import { utc } from "moment";

import { sortUtc } from "../lib/sortUtc";

import { TeamRadioType } from "../types/team-radio.type";

import TeamRadioMessage from "./TeamRadioMessage";
import clsx from "clsx";

type Props = {
	teamRadios: TeamRadioType[] | undefined;
};

export default function TeamRadios({ teamRadios }: Props) {
	return (
		<ul className="flex flex-col gap-2">
			{!teamRadios && new Array(6).fill("").map((_, index) => <SkeletonMessage key={`radio.loading.${index}`} />)}

			{teamRadios && (
				<AnimatePresence>
					{teamRadios.sort(sortUtc).map((teamRadio, i) => (
						<TeamRadioMessage key={`radio.${utc(teamRadio.utc).unix()}.${i}`} teamRadio={teamRadio} />
					))}
				</AnimatePresence>
			)}
		</ul>
	);
}

const SkeletonMessage = () => {
	const animateClass = "h-6 animate-pulse rounded-md bg-gray-700";

	return (
		<li className="flex flex-col gap-1">
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
