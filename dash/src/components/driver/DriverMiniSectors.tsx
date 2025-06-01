import clsx from "clsx";

import type { TimingDataDriver, TimingStatsDriver } from "@/types/state.type";
import { useSettingsStore } from "@/stores/useSettingsStore";

type Props = {
	sectors: TimingDataDriver["sectors"];
	bestSectors: TimingStatsDriver["bestSectors"] | undefined;
	tla: string;
};

export default function DriverMiniSectors({ sectors = [], bestSectors, tla }: Props) {
	const showMiniSectors = useSettingsStore((state) => state.showMiniSectors);
	const showBestSectors = useSettingsStore((state) => state.showBestSectors);

	return (
		<div className="flex gap-2">
			{sectors.map((sector, i) => (
				<div key={`sector.${tla}.${i}`} className="flex flex-col gap-1">
					{showMiniSectors && (
						<div className="flex flex-row gap-1">
							{sector.segments.map((segment, j) => (
								<MiniSector status={segment.status} key={`sector.mini.${tla}.${j}`} />
							))}
						</div>
					)}

					<div className={clsx("flex", showMiniSectors ? "items-center gap-1" : "flex-col")}>
						<p
							className={clsx("text-lg leading-none font-medium tabular-nums", {
								"text-violet-600!": sector.overallFastest,
								"text-emerald-500!": sector.personalFastest,
								"text-zinc-500": !sector.value,
							})}
						>
							{!!sector.value ? sector.value : !!sector.previousValue ? sector.previousValue : "-- ---"}
						</p>

						{showBestSectors && (
							<p
								className={clsx("text-sm leading-none text-zinc-500 tabular-nums", {
									"text-violet-600!": bestSectors?.[i].position === 1,
								})}
							>
								{bestSectors && bestSectors[i].value ? bestSectors[i].value : "-- ---"}
							</p>
						)}
					</div>
				</div>
			))}
		</div>
	);
}

function MiniSector({ status }: { status: number }) {
	return (
		<div
			style={{ width: 10, height: 5, borderRadius: 2 }}
			className={clsx({
				"bg-amber-400": status === 2048 || status === 2052, // TODO unsure
				"bg-emerald-500": status === 2049,
				"bg-violet-600": status === 2051,
				"bg-blue-500": status === 2064,
				"bg-zinc-700": status === 0,
			})}
		/>
	);
}
