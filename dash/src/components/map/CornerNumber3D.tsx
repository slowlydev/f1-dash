import { theme } from "@/styles/tailwindTheme";
import { Text as Text3D } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";

import { Mesh } from "three";

type CornerNumberProps = {
	number: number;
	x: number;
	y: number;
};

export default function CornerNumber({ number, x, y }: CornerNumberProps) {
	const { camera } = useThree();

	const mesh = useRef<Mesh | null>();

	// Make the text face the camera
	useFrame(() => {
		mesh.current?.lookAt(camera.position);
	});

	return (
		<Text3D
			color={theme.colors.zinc[600]}
			ref={mesh}
			position={[x, 0, y]}
			fontSize={300}
			fontWeight="semibold"
			anchorX="center"
			anchorY="middle"
		>
			{number}
		</Text3D>
	);
}
