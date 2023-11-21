"use client";

import { utc } from "moment";

import type { ArchiveSession } from "../types/archive.type";
import DriverTag from "./DriverTag";
import { useState } from "react";

type Props = {
	session: ArchiveSession;
};

export default function MeetingArchiveSession({ session }: Props) {
	const [open, setOpen] = useState<boolean>(false);

	return (
		<div className="flex flex-col divide-y divide-gray-500 rounded-lg bg-gray-500 bg-opacity-20 p-2 backdrop-blur-lg">
			<div className="flex flex-row items-center gap-2 pb-2">
				<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-600">
					<p className="text-xl leading-none">{sessionEmoji(session.type)}</p>
				</div>

				<div className="flex flex-col gap-1">
					<p className="leading-none">{session.name ?? "No name found"}</p>
					<p className="text-sm leading-none text-gray-400">{utc(session.startDate).local().format("LL")}</p>
				</div>
			</div>

			<p
				onClick={() => setOpen((old) => !old)}
				className="cursor-pointer select-none py-1 text-center text-sm text-gray-300"
			>
				{open ? "Hide" : "Show"} Podium
			</p>

			{open && (
				<div className="flex flex-col flex-wrap justify-start gap-2 pt-2 sm:flex-row sm:justify-between">
					{session.topThree.length < 1 && (
						<p className="w-full py-2 text-center text-sm text-gray-400">No Podium found</p>
					)}

					{session.topThree.map((driver, index) => (
						<div key={`session.${session.key}.driver.${driver.nr}.${index}`} className="flex gap-2">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-600">
								<p className="text-xl leading-none">{positionEmoji(parseInt(driver.position))}</p>
							</div>
							<div className="flex items-center justify-center">
								<DriverTag teamColor={driver.teamColor} short={driver.short} />
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

const sessionEmoji = (type: ArchiveSession["type"]): string => {
	switch (type) {
		case "practice":
			return "🏎️";
		case "qualifying":
			return "⏱️";
		case "race":
			return "🏁";
	}
};

const positionEmoji = (position: number): string => {
	switch (position) {
		case 1:
			return "🥇";
		case 2:
			return "🥈";
		case 3:
			return "🥉";
		default:
			return "0";
	}
};
