import React from "react";
import clsx from "clsx";

import { getTimeColor } from "@/lib/getTimeColor";
import { TimingDataDriver } from "@/types/state.type";

type Props = {
	sectors: TimingDataDriver["sectors"];
	tla: string;
};

export default function DriverMiniSectors({ sectors = [], tla }: Props) {
	return (
		<div className="flex gap-2">
			{sectors.map((sector, i) => (
				<div key={`sector.${tla}.${i}`} className="flex flex-col gap-[0.2rem]">
					<div className="flex h-[10px] flex-row gap-1">
						{sector.segments.map((segment, j) => (
							<MiniSector status={segment.status} key={`sector.mini.${tla}.${j}`} />
						))}
					</div>

					<p
						className={clsx(
							"text-lg font-semibold leading-none",
							getTimeColor(sector.overallFastest, sector.personalFastest),
							!sector.value ? "text-gray-500" : "",
						)}
					>
						{!!sector.value ? sector.value : !!sector.previousValue ? sector.previousValue : "-- ---"}
					</p>
				</div>
			))}
		</div>
	);
}

function MiniSector({ status }: { status: number }) {
	return (
		<div
			className={clsx("h-[10px] w-2 rounded-[0.2rem]", {
				"bg-yellow-500": status === 2048 || status === 2052, // TODO unsure
				"bg-emerald-500": status === 2049,
				"bg-indigo-500": status === 2051,
				"bg-blue-500": status === 2064,
				"bg-gray-800": status === 0,
			})}
		/>
	);
}
