import { useEffect, useMemo, useRef, useState } from "react";

import type { FlagType, TrackPosition } from "@/types/map.type";

import { objectEntries } from "@/lib/driverHelper";
import { fetchMap } from "@/lib/fetchMap";
import { getComputedFlagStyle, getTrackStatusMessage } from "@/lib/getTrackStatusMessage";
import { createSectors, findYellowSectors, getSectorColor, MapSector, rad, rotate } from "@/lib/map";
import { toVector3 } from "@/lib/r3f";
import { useDataStore, usePositionStore } from "@/stores/useDataStore";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { theme } from "@/styles/tailwindTheme";
import { Line, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Vector3 } from "three";
import CornerNumber from "./CornerNumber3D";
import { InterpolatedDriverIndicator } from "./DriverIndicator";
import MapLoader from "./MapLoader";

const SPACE = 1000;
const ROTATION_FIX = 90;
const CAMERA_FOV = 35;

type Corner = {
	number: number;
	pos: TrackPosition;
	labelPos: TrackPosition;
};

type RenderedSector3D = {
	number: number;
	points: TrackPosition[];
	flagType: FlagType;
	hex: string;
	strokeWidth: number;
	pulse?: number;
};

function prioritizeColoredSectors3D(a: RenderedSector3D, b: RenderedSector3D) {
	if (a.flagType === "GREEN" && b.flagType !== "GREEN") {
		return -1;
	}
	if (a.flagType !== "GREEN" && b.flagType === "GREEN") {
		return 1;
	}
	return a.number - b.number;
}

function getCenter(xPoints: number[], yPoints: number[]) {
	const maxBounds = {
		x: Math.max(...xPoints),
		y: Math.max(...yPoints),
	};

	const minBounds = {
		x: Math.min(...xPoints),
		y: Math.min(...yPoints),
	};

	return {
		x: (maxBounds.x - minBounds.x) * 0.5 + minBounds.x,
		y: (maxBounds.y - minBounds.y) * 0.5 + minBounds.y,
	};
}

export default function Map3D() {
	const showCornerNumbers = useSettingsStore((state) => state.showCornerNumbers);
	const favoriteDrivers = useSettingsStore((state) => state.favoriteDrivers);

	const positions = usePositionStore((state) => state.positions);
	const drivers = useDataStore((state) => state?.driverList);
	const trackStatus = useDataStore((state) => state?.trackStatus);
	const timingDrivers = useDataStore((state) => state?.timingData);
	const raceControlMessages = useDataStore((state) => state?.raceControlMessages?.messages);
	const circuitKey = useDataStore((state) => state?.sessionInfo?.meeting.circuit.key);

	const [[minX, minY, widthX, widthY], setBounds] = useState<(null | number)[]>([null, null, null, null]);
	const [[centerX, centerY], setCenter] = useState<number[]>([0, 0]);

	const [points, setPoints] = useState<null | TrackPosition[]>(null);
	const [sectors, setSectors] = useState<MapSector[]>([]);
	const [corners, setCorners] = useState<Corner[]>([]);
	const [rotation, setRotation] = useState<number>(0);

	// FIXME: This is garbage but I am struggling finding the proper type
	const controlsRef = useRef<any>(null);

	const defaultCameraDistance = useMemo(() => Math.max(widthX ?? 0, widthY ?? 0), [widthX, widthY]);
	const defaultCameraPosition = useMemo(
		() => [centerX, defaultCameraDistance, centerY + defaultCameraDistance] as const,
		[centerX, centerY, defaultCameraDistance],
	);
	const yellowSectors = useMemo(() => findYellowSectors(raceControlMessages), [raceControlMessages]);
	const renderedSectors = useMemo(() => {
		const status = getTrackStatusMessage(trackStatus?.status ? parseInt(trackStatus.status) : undefined);
		return sectors
			.map<RenderedSector3D>((sector) => {
				const flagType = getSectorColor(sector, status?.bySector, status?.flagType, yellowSectors);
				const { trackHex } = getComputedFlagStyle(flagType);
				return {
					hex: trackHex,
					flagType: flagType,
					pulse: status?.pulse,
					number: sector.number,
					strokeWidth: flagType === "GREEN" ? 2 : 5,
					points: sector.points,
				};
			})
			.sort(prioritizeColoredSectors3D);
	}, [trackStatus, sectors]);

	useEffect(() => {
		const loadMap = async () => {
			if (!circuitKey) return;
			const mapJson = await fetchMap(circuitKey);

			const { x: mapCenterX, y: mapCenterY } = getCenter(mapJson.x, mapJson.y);

			const fixedRotation = mapJson.rotation + ROTATION_FIX;

			const sectors = createSectors(mapJson).map((s) => ({
				...s,
				start: rotate(s.start.x, s.start.y, fixedRotation, mapCenterX, mapCenterY),
				end: rotate(s.end.x, s.end.y, fixedRotation, mapCenterX, mapCenterY),
				points: s.points.map((p) => rotate(p.x, p.y, fixedRotation, mapCenterX, mapCenterY)),
			}));

			const cornerPositions = mapJson.corners.map<Corner>((corner) => ({
				number: corner.number,
				pos: rotate(corner.trackPosition.x, corner.trackPosition.y, fixedRotation, mapCenterX, mapCenterY),
				labelPos: rotate(
					corner.trackPosition.x + 540 * Math.cos(rad(corner.angle)),
					corner.trackPosition.y + 540 * Math.sin(rad(corner.angle)),
					fixedRotation,
					mapCenterX,
					mapCenterY,
				),
			}));

			const rotatedPoints = mapJson.x.map((x, index) =>
				rotate(x, mapJson.y[index], fixedRotation, mapCenterX, mapCenterY),
			);

			const pointsX = rotatedPoints.map((item) => item.x);
			const pointsY = rotatedPoints.map((item) => item.y);

			const cMinX = Math.min(...pointsX) - SPACE;
			const cMinY = Math.min(...pointsY) - SPACE;
			const cWidthX = Math.max(...pointsX) - cMinX + SPACE * 2;
			const cWidthY = Math.max(...pointsY) - cMinY + SPACE * 2;

			setCenter([mapCenterX, mapCenterY]);
			setBounds([cMinX, cMinY, cWidthX, cWidthY]);
			setSectors(sectors);
			setPoints(rotatedPoints);
			setRotation(fixedRotation);
			setCorners(cornerPositions);
		};

		loadMap();
	}, [circuitKey]);

	if (!points || !minX || !minY || !widthX || !widthY) {
		return <MapLoader />;
	}

	return (
		<div className="relative">
			<div className="absolute bottom-1 right-1 z-10">
				<button
					onClick={() => {
						controlsRef.current?.reset();
					}}
				>
					Reset Camera
				</button>
			</div>

			<Canvas
				camera={{
					position: defaultCameraPosition,
					far: defaultCameraDistance * 3,
					fov: CAMERA_FOV,
				}}
			>
				<ambientLight intensity={Math.PI * 0.5} />
				<spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
				<pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
				<Line
					renderOrder={0}
					points={points.map((point) => toVector3(point))}
					color={theme.colors.gray[800]}
					lineWidth={2}
				/>
				{renderedSectors.map((sector) => (
					<Line
						renderOrder={1}
						key={sector.number}
						points={sector.points.map((point) => new Vector3(point.x, 0, point.y))}
						color={sector.hex}
						lineWidth={sector.strokeWidth}
					/>
				))}
				{showCornerNumbers &&
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
						{objectEntries(drivers)
							.reverse()
							.filter((driver) => !!positions[driver.racingNumber].X && !!positions[driver.racingNumber].Y)
							.map((driver) => {
								const timingDriver = timingDrivers?.lines[driver.racingNumber];
								const hidden = timingDriver
									? timingDriver.knockedOut || timingDriver.stopped || timingDriver.retired
									: false;
								const pit = timingDriver?.inPit ?? false;

								return (
									<InterpolatedDriverIndicator
										key={`map.driver.${driver.racingNumber}`}
										favoriteDriver={favoriteDrivers.length > 0 ? favoriteDrivers.includes(driver.racingNumber) : false}
										name={driver.tla}
										color={driver.teamColour}
										pit={pit}
										hidden={hidden}
										pos={positions[driver.racingNumber]}
										rotation={rotation}
										centerX={centerX}
										centerY={centerY}
										racingNumber={driver.racingNumber}
									/>
								);
							})}
					</>
				)}
				<OrbitControls
					ref={controlsRef}
					maxDistance={defaultCameraDistance * 2}
					target0={new Vector3(centerX, 0, centerY)}
				/>
			</Canvas>
		</div>
	);
}
