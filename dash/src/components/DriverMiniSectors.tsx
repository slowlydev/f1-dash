import React from "react";
import clsx from "clsx";

import { DriverType } from "../types/driver.type";

import { getTimeColor } from "../lib/getTimeColor";

type Props = {
	sectors: DriverType["sectors"];
	driverDisplayName: string;
};

export default function DriverMiniSectors({ sectors, driverDisplayName }: Props) {
	return (
		<div className="flex gap-2">
			{sectors.map((sector, index) => (
				<div key={`sector.${driverDisplayName}.${index}`} className="flex flex-col gap-[0.2rem]">
					<div className="flex h-[10px] flex-row gap-1">
						{sector.segments.map((segmentStatus, index2) => (
							<MiniSector status={segmentStatus} key={`sector.mini.${driverDisplayName}.${index2}`} />
						))}
					</div>

					<p
						className={clsx(
							"text-lg font-semibold leading-none",
							getTimeColor(sector.current.fastest, sector.current.pb),
							!sector.current.value ? "text-gray-500" : "",
						)}
					>
						{!!sector.current.value ? sector.current.value : !!sector.last.value ? sector.last.value : "-- ---"}
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
				"bg-purple-700": status === 2051,
				"bg-blue-500": status === 2064,
				"bg-gray-800": status === 0,
			})}
		/>
	);
}
