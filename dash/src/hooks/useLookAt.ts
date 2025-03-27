import { useFrame } from "@react-three/fiber";
import { Object3D, Vector3 } from "three";

type LookAtProps = {
	object: Object3D | undefined | null;
	target: Vector3;
};

/**
 * Make a THREE object look at target.
 */
export function useLookAt({ object, target }: LookAtProps) {
	useFrame(() => object?.lookAt(target));
}
