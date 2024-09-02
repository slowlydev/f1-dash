import { useEffect, useState } from "react";
import clsx from "clsx";

import {
	DriverList,
	TimingData,
	TrackStatus,
	Message as RaceControlMessage,
	Positions,
	PositionCar,
} from "@/types/state.type";

import { objectEntries } from "@/lib/driverHelper";
import { fetchMap } from "@/lib/fetchMap";
import { MapType, TrackPosition } from "@/types/map.type";
import { sortUtc } from "@/lib/sorting/sortUtc";
import { getTrackStatusMessage } from "@/lib/getTrackStatusMessage";

// This is basically fearlessly copied from
// https://github.com/tdjsnelling/monaco

import { useMode } from "@/context/ModeContext";

type Props = {
	circuitKey: number | undefined;
	drivers: DriverList | undefined;
	timingDrivers: TimingData | undefined;
	positions: Positions | null;

	trackStatus: TrackStatus | undefined;
	raceControlMessages: RaceControlMessage[] | undefined;
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
	number: number;
	start: TrackPosition;
	end: TrackPosition;
	points: TrackPosition[];
};

const calculateDistance = (x1: number, y1: number, x2: number, y2: number) => {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

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
};

const createSectors = (map: MapType) => {
	const sectors: Sector[] = [];
	const points: TrackPosition[] = map.x.map((x, index) => ({ x, y: map.y[index] }));

	for (let i = 0; i < map.marshalSectors.length; i++) {
		sectors.push({
			number: i + 1,
			start: map.marshalSectors[i].trackPosition,
			end: map.marshalSectors[i + 1] ? map.marshalSectors[i + 1].trackPosition : map.marshalSectors[0].trackPosition,
			points: [],
		});
	}

	let dividers: number[] = sectors.map((s) => findMinDistance(s.start, points));
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
};

const findYellowSectors = (messages: RaceControlMessage[] | undefined): Set<number> => {
	const msgs = messages?.sort(sortUtc).filter((msg) => {
		return msg.flag === "YELLOW" || msg.flag === "DOUBLE YELLOW" || msg.flag === "CLEAR";
	});

	if (!msgs) {
		return new Set();
	}

	const done: Set<number> = new Set();
	const sectors: Set<number> = new Set();
	for (let i = 0; i < msgs.length; i++) {
		const msg = msgs[i];
		if (msg.scope === "Track" && msg.flag !== "CLEAR") {
			// Spam with sectors so all sectors are yellow no matter what
			// number of sectors there really are
			for (let j = 0; j < 100; j++) {
				sectors.add(j);
			}
			return sectors;
		}
		if (msg.scope === "Sector") {
			if (!msg.sector || done.has(msg.sector)) {
				continue;
			}
			if (msg.flag === "CLEAR") {
				done.add(msg.sector);
			} else {
				sectors.add(msg.sector);
			}
		}
	}
	return sectors;
};

type RenderedSector = {
	number: number;
	d: string;
	color: string;
	stroke_width: number;
	pulse?: number;
};

const priorizeColoredSectors = (a: RenderedSector, b: RenderedSector) => {
	if (a.color === "stroke-white" && b.color !== "stroke-white") {
		return -1;
	}
	if (a.color !== "stroke-white" && b.color === "stroke-white") {
		return 1;
	}
	return a.number - b.number;
};

const rotationFIX = 90;

type Corner = {
	number: number;
	pos: TrackPosition;
	labelPos: TrackPosition;
};

export default function Map({
	circuitKey,
	drivers,
	timingDrivers,
	trackStatus,
	raceControlMessages,
	positions,
}: Props) {
	const { uiElements } = useMode();

	const [points, setPoints] = useState<null | { x: number; y: number }[]>(null);
	const [sectors, setSectors] = useState<Sector[]>([]);

	const [corners, setCorners] = useState<Corner[]>([]);

	const [rotation, setRotation] = useState<number>(0);

	const [[minX, minY, widthX, widthY], setBounds] = useState<(null | number)[]>([null, null, null, null]);
	const [[centerX, centerY], setCenter] = useState<(null | number)[]>([null, null]);

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
			});

			const cornerPositions: Corner[] = mapJson.corners.map((corner) => {
				const pos = rotate(corner.trackPosition.x, corner.trackPosition.y, fixedRotation, centerX, centerY);
				const labelPos = rotate(
					corner.trackPosition.x + 540 * Math.cos(rad(corner.angle)),
					corner.trackPosition.y + 540 * Math.sin(rad(corner.angle)),
					fixedRotation,
					centerX,
					centerY,
				);
				return {
					number: corner.number,
					pos,
					labelPos,
				};
			});

			const rotatedPoints = mapJson.x.map((x, index) => rotate(x, mapJson.y[index], fixedRotation, centerX, centerY));

			const pointsX = rotatedPoints.map((item) => item.x);
			const pointsY = rotatedPoints.map((item) => item.y);

			const cMinX = Math.min(...pointsX) - space;
			const cMinY = Math.min(...pointsY) - space;
			const cWidthX = Math.max(...pointsX) - cMinX + space * 2;
			const cWidthY = Math.max(...pointsY) - cMinY + space * 2;

			setCenter([centerX, centerY]);
			setBounds([cMinX, cMinY, cWidthX, cWidthY]);
			setSectors(sectors);
			setPoints(rotatedPoints);
			setRotation(fixedRotation);
			setCorners(cornerPositions);
		})();
	}, [circuitKey]);

	const [renderedSectors, setRenderedSectors] = useState<RenderedSector[]>([]);
	useEffect(() => {
		const status = getTrackStatusMessage(trackStatus?.status ? parseInt(trackStatus?.status) : undefined);
		let color: (sector: Sector) => string;
		if (status?.bySector) {
			const yellowSectors = findYellowSectors(raceControlMessages);
			color = (sector) => {
				if (yellowSectors.has(sector.number)) {
					return status?.trackColor || "stroke-white";
				} else {
					return "stroke-white";
				}
			};
		} else {
			color = (_) => status?.trackColor || "stroke-white";
		}

		const newSectors: RenderedSector[] = sectors
			.map((sector) => {
				const start = `M${sector.points[0].x},${sector.points[0].y}`;
				const rest = sector.points.map((point) => `L${point.x},${point.y}`).join(" ");

				const c = color(sector);
				return {
					number: sector.number,
					d: `${start} ${rest}`,
					color: c,
					stroke_width: c === "stroke-white" ? 60 : 120,
					pulse: status?.pulse,
				};
			})
			.sort(priorizeColoredSectors);

		setRenderedSectors(newSectors);
	}, [trackStatus, raceControlMessages, sectors]);

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

			{renderedSectors.map((sector) => {
				const style = sector.pulse
					? {
							animation: `${sector.pulse * 100}ms linear infinite pulse`,
						}
					: {};
				return (
					<path
						key={`map.sector.${sector.number}`}
						className={sector.color}
						strokeWidth={sector.stroke_width}
						strokeLinecap="round"
						strokeLinejoin="round"
						fill="transparent"
						d={sector.d}
						style={style}
					/>
				);
			})}

			{uiElements.showCornerNumbers &&
				corners.map((corner) => (
					<CornerNumber
						key={`corner.${corner.number}`}
						number={corner.number}
						x={corner.labelPos.x}
						y={corner.labelPos.y}
					/>
				))}

			{centerX && centerY && positions && drivers && (
				<>
					{/* 241 is safty car */}
					{/* theres also 242 and 243 which might be medical car and something else  */}
					{positions["241"] && (
						<CarDot
							key={`map.car.241`}
							name="Safety Car"
							pit={false}
							hidden={false}
							pos={positions["241"]}
							color={undefined}
							rotation={rotation}
							centerX={centerX}
							centerY={centerY}
						/>
					)}

					{objectEntries(drivers)
						.reverse()
						.filter((driver) => !!positions[driver.racingNumber].X && !!positions[driver.racingNumber].Y)
						.map((driver) => {
							const timingDriver = timingDrivers?.lines[driver.racingNumber];
							const hidden = timingDriver
								? timingDriver.knockedOut || timingDriver.stopped || timingDriver.retired
								: false;
							const pit = timingDriver ? timingDriver.inPit : false;

							return (
								<CarDot
									key={`map.driver.${driver.racingNumber}`}
									name={driver.tla}
									color={driver.teamColour}
									pit={pit}
									hidden={hidden}
									pos={positions[driver.racingNumber]}
									rotation={rotation}
									centerX={centerX}
									centerY={centerY}
								/>
							);
						})}
				</>
			)}
		</svg>
	);
}

type CornerNumberProps = {
	number: number;
	x: number;
	y: number;
};

const CornerNumber: React.FC<CornerNumberProps> = ({ number, x, y }) => {
	return (
		<text x={x} y={y} className="fill-zinc-700" fontSize={300} fontWeight="semibold">
			{number}
		</text>
	);
};

type CarDotProps = {
	name: string;
	color: string | undefined;

	pit: boolean;
	hidden: boolean;

	pos: PositionCar;
	rotation: number;

	centerX: number;
	centerY: number;
};

const CarDot = ({ pos, name, color, pit, hidden, rotation, centerX, centerY }: CarDotProps) => {
	const rotatedPos = rotate(pos.X, pos.Y, rotation, centerX, centerY);
	const transform = [`translateX(${rotatedPos.x}px)`, `translateY(${rotatedPos.y}px)`].join(" ");

	return (
		<g
			className={clsx("fill-zinc-700", { "opacity-30": pit }, { "!opacity-0": hidden })}
			style={{
				transition: "all 1s linear",
				transform,
				...(color && { fill: `#${color}` }),
			}}
		>
			<circle id={`map.driver.circle`} r={120} />
			<text
				id={`map.driver.text`}
				fontWeight="bold"
				fontSize={120 * 3}
				style={{
					transform: "translateX(150px) translateY(-120px)",
				}}
			>
				{name}
			</text>
		</g>
	);
};
