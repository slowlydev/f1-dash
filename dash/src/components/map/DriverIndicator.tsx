import { rotate } from "@/lib/map";
import { toVector3 } from "@/lib/r3f";
import { theme } from "@/styles/tailwindTheme";
import { PositionCar } from "@/types/state.type";
import { Billboard, Line, Sphere } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Container, Root, Text as TextUI } from "@react-three/uikit";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Color, MeshBasicMaterial, Vector3 } from "three";

function calculateAverageUpdateTime(history: number[]) {
	if (history.length < 2) return 0;

	let totalAmount = 0;
	for (let i = 0; i < history.length; ++i) {
		const current = history[i];
		const previous = history[i - 1];
		const delta = current - previous;
		totalAmount += delta;
	}

	return totalAmount / (history.length - 1);
}

type DriverIndicatorProps = {
	name: string;
	color: string | undefined;
	racingNumber: string;
	favoriteDriver: boolean;

	pit: boolean;
	hidden: boolean;

	pos: PositionCar;
	rotation: number;

	centerX: number;
	centerY: number;
};

export function DriverIndicator({
	pos,
	name,
	color,
	racingNumber,
	favoriteDriver,
	pit,
	hidden,
	rotation,
	centerX,
	centerY,
}: DriverIndicatorProps) {
	const rotatedPos = rotate(pos.X, pos.Y, rotation, centerX, centerY);

	const opacity = useMemo(() => {
		if (pit) return 0.3;
		return hidden ? 0 : 1;
	}, [pit, hidden]);

	const material = useMemo(() => {
		const m = new MeshBasicMaterial();
		m.transparent = true;
		m.opacity = opacity;
		m.color = new Color(`#${color}`);
		return m;
	}, [color, opacity]);

	if (hidden) {
		return null;
	}

	return (
		<group position={toVector3(rotatedPos)}>
			<Billboard>
				<Line
					points={[
						[0, 0, 0],
						[0, 450, 0],
					]}
					transparent={true}
					opacity={opacity}
					color={theme.colors.white}
				/>
				<group renderOrder={favoriteDriver ? 40 : 20} position={[200, favoriteDriver ? 600 : 450, 0]}>
					<Root backgroundOpacity={opacity} backgroundColor={theme.colors.zinc[700]} sizeX={1050} sizeY={350}>
						<Container
							alignItems="center"
							justifyContent="center"
							flexGrow={0.4}
							backgroundColor={`#${color}`}
							backgroundOpacity={opacity}
						>
							<TextUI
								textAlign="center"
								verticalAlign="center"
								color={theme.colors.white}
								opacity={opacity}
								fontWeight="bold"
								fontSize={favoriteDriver ? 32000 : 24000}
							>
								{racingNumber}
							</TextUI>
						</Container>
						<Container alignItems="center" justifyContent="center" flexGrow={0.6}>
							<TextUI
								textAlign="center"
								verticalAlign="center"
								color={`#${color}`}
								opacity={opacity}
								fontWeight="bold"
								fontSize={24000}
							>
								{name}
							</TextUI>
						</Container>
					</Root>
				</group>
			</Billboard>
			<Sphere renderOrder={2} material={material} scale={favoriteDriver ? 180 : 120} />
		</group>
	);
}

type InterpolatedDriverIndicatorProps = DriverIndicatorProps & {
	interpolationLength?: number;
};

export function InterpolatedDriverIndicator({
	pos,
	interpolationLength = 8,
	...props
}: InterpolatedDriverIndicatorProps) {
	const incomingPosition = useMemo(() => new Vector3(pos.X, 0, pos.Y), [pos]);
	const [currentPosition, setCurrentPosition] = useState(new Vector3());
	const [previousPosition, setPreviousPosition] = useState(new Vector3());
	const [interpolatedPosition, setInterpolatedPosition] = useState(new Vector3());
	const [interpolationFactor, setInterpolationFactor] = useState(0);
	const [shouldUpdatePosition, setShouldUpdatePosition] = useState(false);
	const updatesHistoryRef = useRef<number[]>([]);

	useEffect(() => {
		// Delegate update to the next frame
		setShouldUpdatePosition(true);
	}, [incomingPosition]);

	const updatePosition = useCallback(() => {
		const { current: updatesHistory } = updatesHistoryRef;

		// Only set previous position if current position is valid
		if (currentPosition.length() > 0) {
			setPreviousPosition(currentPosition.clone());
		}
		setCurrentPosition(incomingPosition.clone());
		setInterpolationFactor(0);

		// Record timestamp in history
		const timestamp = performance.now();
		updatesHistory.push(timestamp);
		if (updatesHistory.length > interpolationLength) {
			updatesHistory.shift();
		}

		// Clear position update flag
		setShouldUpdatePosition(false);
	}, [currentPosition, incomingPosition, updatesHistoryRef]);

	useFrame((_, delta) => {
		shouldUpdatePosition && updatePosition();

		const { current: updatesHistory } = updatesHistoryRef;

		const averageTimeBetweenUpdatesInMillis = calculateAverageUpdateTime(updatesHistory) / 1000;
		const interpolationRate = 1 / averageTimeBetweenUpdatesInMillis;
		const interpolationSpeed = averageTimeBetweenUpdatesInMillis > 0 ? interpolationRate : 1;

		if (interpolationFactor < 1) {
			// Interpolate position
			const newInterpolatedPosition = new Vector3().lerpVectors(previousPosition, currentPosition, interpolationFactor);
			setInterpolatedPosition(newInterpolatedPosition);
			setInterpolationFactor((prev) => Math.min(1, prev + delta * interpolationSpeed));
		} else {
			// Clamp to last known position
			setInterpolatedPosition(currentPosition);
		}
	});

	return (
		<DriverIndicator
			pos={{
				Status: pos.Status,
				X: interpolatedPosition.x,
				Y: interpolatedPosition.z,
				Z: pos.Z,
			}}
			{...props}
		/>
	);
}
