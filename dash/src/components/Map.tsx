import { useEffect, useState } from "react";
import { utc } from "moment";
import clsx from "clsx";

import { DriverList, Position, TimingData } from "@/types/state.type";

import { objectEntries } from "@/lib/driverHelper";
import { fetchMap } from "@/lib/fetchMap";

// This is basically fearlessly copied from
// https://github.com/tdjsnelling/monaco

type Props = {
	circuitKey: number | undefined;
	drivers: DriverList | undefined;
	timingDrivers: TimingData | undefined;
	positionBatches: Position | null;
};

const space = 1000;

const rad = (deg: number) => deg * (Math.PI / 180);

const rotate = (x: number, y: number, a: number, px: number, py: number) => {
	const c = Math.cos(rad(a));
	const s = Math.sin(rad(a));

	x -= px;
	y -= py;

	const newX = x * c - y * s;
	const newY = y * c + x * s;

	return { y: newX + px, x: newY + py };
};

const rotationFIX = 90;

export default function Map({ circuitKey, drivers, timingDrivers, positionBatches }: Props) {
	const [points, setPoints] = useState<null | { x: number; y: number }[]>(null);
	const [rotation, setRotation] = useState<number>(0);

	const [[minX, minY, widthX, widthY], setBounds] = useState<(null | number)[]>([null, null, null, null]);
	const [[centerX, centerY], setCenter] = useState<(null | number)[]>([null, null]);

	const positions = positionBatches
		? positionBatches.Position.sort((a, b) => utc(b.Timestamp).diff(utc(a.Timestamp)))[0].Entries
		: null;

	useEffect(() => {
		(async () => {
			if (!circuitKey) return;
			const mapJson = await fetchMap(circuitKey);

			const centerX = (Math.max(...mapJson.x) - Math.min(...mapJson.x)) / 2;
			const centerY = (Math.max(...mapJson.y) - Math.min(...mapJson.y)) / 2;

			const fixedRotation = mapJson.rotation + rotationFIX;

			const rotatedPoints = mapJson.x.map((x, index) => rotate(x, mapJson.y[index], fixedRotation, centerX, centerY));

			const pointsX = rotatedPoints.map((item) => item.x);
			const pointsY = rotatedPoints.map((item) => item.y);

			const cMinX = Math.min(...pointsX) - space;
			const cMinY = Math.min(...pointsY) - space;
			const cWidthX = Math.max(...pointsX) - cMinX + space * 2;
			const cWidthY = Math.max(...pointsY) - cMinY + space * 2;

			setCenter([centerX, centerY]);
			setBounds([cMinX, cMinY, cWidthX, cWidthY]);
			setPoints(rotatedPoints);
			setRotation(fixedRotation);
		})();
	}, [circuitKey]);

	if (!points || !minX || !minY || !widthX || !widthY)
		return (
			<div className="h-full w-full p-2" style={{ minHeight: "35rem" }}>
				<div className="h-full w-full animate-pulse rounded-lg bg-zinc-800" />
			</div>
		);

	return (
		<svg
			viewBox={`${minX} ${minY} ${widthX} ${widthY}`}
			className="h-full w-full xl:max-h-screen"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				className="stroke-gray-800"
				strokeWidth={300}
				strokeLinejoin="round"
				fill="transparent"
				d={`M${points[0].x},${points[0].y} ${points.map((point) => `L${point.x},${point.y}`).join(" ")}`}
			/>

			<path
				stroke="white"
				strokeWidth={80}
				strokeLinejoin="round"
				fill="transparent"
				d={`M${points[0].x},${points[0].y} ${points.map((point) => `L${point.x},${point.y}`).join(" ")}`}
			/>

			{centerX && centerY && positions && drivers && (
				<>
					{objectEntries(drivers)
						.reverse()
						.filter((driver) => !!positions[driver.racingNumber].X && !!positions[driver.racingNumber].Y)
						.map((driver) => {
							const pos = positions[driver.racingNumber];
							const timingDriver = timingDrivers?.lines[driver.racingNumber];
							const hidden = timingDriver ? timingDriver.knockedOut : false;
							const pit = timingDriver ? timingDriver.inPit || timingDriver.pitOut : false;

							const rotatedPos = rotate(pos.X, pos.Y, rotation, centerX, centerY);
							const transform = [`translateX(${rotatedPos.x}px)`, `translateY(${rotatedPos.y}px)`].join(" ");

							return (
								<g
									key={`map.driver.${driver.racingNumber}`}
									id={`map.driver.${driver.racingNumber}`}
									className={clsx("fill-zinc-700", { "opacity-30": pit }, { "opacity-0": hidden })}
									style={{
										transition: "all 1s linear",
										transform,
										...(driver.teamColour && { fill: `#${driver.teamColour}` }),
									}}
								>
									<circle id={`map.driver.${driver.racingNumber}.circle`} r={120} />
									<text
										id={`map.driver.${driver.racingNumber}.text`}
										fontWeight="bold"
										fontSize={120 * 3}
										style={{
											transform: "translateX(150px) translateY(-120px)",
										}}
									>
										{driver.tla}
									</text>
								</g>
							);
						})}
				</>
			)}
		</svg>
	);
}
