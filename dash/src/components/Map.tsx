import { useEffect, useState } from "react";
import { DriverPositionBatch } from "../types/positions.type";
import { SessionInfo } from "../types/session.type";
import { utc } from "moment";
import clsx from "clsx";

import { sortPos } from "../lib/sortPos";
import { fetchMap } from "../lib/fetchMap";
import { MapType, TrackPosition } from "@/types/map.type";
import {RaceControlMessageType} from "@/types/race-control-message.type";
import {sortUtc} from "@/lib/sortUtc";

// This is basically fearlessly copied from
// https://github.com/tdjsnelling/monaco

type Props = {
	circuitKey: SessionInfo["circuitKey"] | undefined;
	positionBatches: DriverPositionBatch[] | undefined;
	raceControlMessages: RaceControlMessageType[] | undefined;
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

type Sector = {
	"number": number,
	"start": TrackPosition,
	"end": TrackPosition,
	"points": TrackPosition[],
}

const calculateDistance = (x1: number, y1: number, x2: number, y2: number) => {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

const findMinDistance = (point: TrackPosition, points: TrackPosition[]) => {
	let min = Infinity;
	let minIndex = -1;
	for (let i = 0; i < points.length; i++) {
		const distance = calculateDistance(point.x, point.y, points[i].x, points[i].y);
		if (distance < min) {
			min = distance;
			minIndex = i;
		}
	}
	return minIndex;
}

const sector_color = (sector: number, messages: RaceControlMessageType[] | undefined) => {
	const msg = messages?.sort(sortUtc).find((msg) => {
		if (msg.scope === "Sector" && msg.sector !== sector) {
			return false;
		}
		if (msg.flag) {
			return ["CLEAR", "YELLOW", "DOUBLE YELLOW", "RED"].includes(msg.flag);
		}
		return msg.category === "SafetyCar";
	})

	if (!msg || msg.flag === "CLEAR") {
		return "#FFFFFF";
	}
	if (msg.flag === "YELLOW" || msg.flag === "DOUBLE YELLOW") {
		return "#ffff14";
	}
	// @ts-ignore
	if (msg.flag === "RED") {
		return "#930013";
	}
	if (msg.category === "SafetyCar") {
		return "#44DDEE";
	}
	return "#FFFFFF";
}

const createSectors = (data: MapType) => {
	const sectors: Sector[] = [];
	const points: TrackPosition[] = data.x.map((x, index) => ({ x, y: data.y[index] }));

	for (let i = 0; i < data.marshalSectors.length; i++) {
		sectors.push({
			number: i + 1,
			start: data.marshalSectors[i].trackPosition,
			end: data.marshalSectors[i + 1] ? data.marshalSectors[i + 1].trackPosition : data.marshalSectors[0].trackPosition,
			points: []
		});
	}

	let dividers: number[] = sectors.map(s => findMinDistance(s.start, points));
	for (let i = 0; i < dividers.length; i++) {
		let start = dividers[i];
		let end = dividers[i + 1] ? dividers[i + 1] : dividers[0];
		if (start < end) {
			sectors[i].points = points.slice(start, end + 1);
		} else {
			sectors[i].points = points.slice(start).concat(points.slice(0, end + 1));
		}
	}

	return sectors;
}

const rotationFIX = 90;

export default function Map({ circuitKey, raceControlMessages, positionBatches }: Props) {
	const [points, setPoints] = useState<null | { x: number; y: number }[]>(null);
	const [sectors, setSectors] = useState<Sector[]>([]);

	const [rotation, setRotation] = useState<number>(0);
	const [ogPoints, setOgPoints] = useState<null | { x: number; y: number }[]>(null);

	const [[minX, minY, widthX, widthY], setBounds] = useState<(null | number)[]>([null, null, null, null]);

	const positions = positionBatches ? positionBatches.sort((a, b) => utc(b.utc).diff(utc(a.utc)))[0].positions : null;

	useEffect(() => {
		(async () => {
			if (!circuitKey) return;
			const mapJson = await fetchMap(circuitKey);

			const centerX = (Math.max(...mapJson.x) - Math.min(...mapJson.x)) / 2;
			const centerY = (Math.max(...mapJson.y) - Math.min(...mapJson.y)) / 2;

			const fixedRotation = mapJson.rotation + rotationFIX;

			const sectors = createSectors(mapJson).map((s) => {
				const start = rotate(s.start.x, s.start.y, fixedRotation, centerX, centerY);
				const end = rotate(s.end.x, s.end.y, fixedRotation, centerX, centerY);
				const points = s.points.map((p) => rotate(p.x, p.y, fixedRotation, centerX, centerY));
				return {
					...s,
					start,
					end,
					points,
				};
			})

			const rotatedPoints = mapJson.x.map((x, index) => rotate(x, mapJson.y[index], fixedRotation, centerX, centerY));

			const pointsX = rotatedPoints.map((item) => item.x);
			const pointsY = rotatedPoints.map((item) => item.y);

			const cMinX = Math.min(...pointsX) - space;
			const cMinY = Math.min(...pointsY) - space;
			const cWidthX = Math.max(...pointsX) - cMinX + space * 2;
			const cWidthY = Math.max(...pointsY) - cMinY + space * 2;

			setBounds([cMinX, cMinY, cWidthX, cWidthY]);
			setSectors(sectors);
			setPoints(rotatedPoints);
			setRotation(fixedRotation);
			setOgPoints(mapJson.x.map((xItem, index) => ({ x: xItem, y: mapJson.y[index] })));
		})();
	}, [circuitKey]);

	if (!points || !minX || !minY || !widthX || !widthY)
		return (
			<div className="flex h-full w-full items-center justify-center">
				<div className="h-5/6 w-5/6 animate-pulse rounded-lg bg-gray-700" />
			</div>
		);

	return (
		<svg
			viewBox={`${minX} ${minY} ${widthX} ${widthY}`}
			className="h-full w-full xl:max-h-screen"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				className="stroke-slate-700"
				strokeWidth={300}
				strokeLinejoin="round"
				fill="transparent"
				d={`M${points[0].x},${points[0].y} ${points.map((point) => `L${point.x},${point.y}`).join(" ")}`}
			/>

			{<>{
				sectors.map((sector) => {
					const start = `M${sector.points[0].x},${sector.points[0].y}`;
					const rest = sector.points.map((point) => `L${point.x},${point.y}`).join(" ");
					const color = sector_color(sector.number, raceControlMessages)
					return (
						<path
							key={`map.sector.${sector.number}`}
							stroke={color}
							strokeWidth={color === "#FFFFFF" ? 60 : 120}
							strokeLinecap="round"
							strokeLinejoin="round"
							fill="transparent"
							d={`${start} ${rest}`}
						/>
					);
				})
			}</>}

			{ogPoints && positions && (
				<>
					{positions
						.sort(sortPos)
						.reverse()
						.map((pos) => {
							// TODO move to backend
							const xS = ogPoints.map((item) => item.x);
							const yS = ogPoints.map((item) => item.y);

							const rotatedPos = rotate(
								pos.x,
								pos.y,
								rotation,
								(Math.max(...xS) - Math.min(...xS)) / 2,
								(Math.max(...yS) - Math.min(...yS)) / 2,
							);

							const out = pos.status === "OUT" || pos.status === "RETIRED" || pos.status === "STOPPED";

							const transform = [`translateX(${rotatedPos.x}px)`, `translateY(${rotatedPos.y}px)`].join(" ");

							return (
								<g
									key={`map.driver.${pos.driverNr}`}
									id={`map.driver.${pos.driverNr}`}
									className={clsx("fill-zinc-700", { "opacity-30": out })}
									style={{
										transition: "all 1s linear",
										transform,
										...(pos.teamColor && { fill: `#${pos.teamColor}` }),
									}}
								>
									<circle id={`map.driver.${pos.driverNr}.circle`} r={120} />
									<text
										id={`map.driver.${pos.driverNr}.text`}
										fontWeight="bold"
										fontSize={120 * 3}
										style={{
											transform: "translateX(150px) translateY(-120px)",
										}}
									>
										{pos.short}
									</text>
								</g>
							);
						})}
				</>
			)}
		</svg>
	);
}
