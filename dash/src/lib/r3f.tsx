import { TrackPosition } from "@/types/map.type";
import { Vector3 } from "three";

export function toVector3(point: TrackPosition) {
	return new Vector3(point.x, 0, point.y);
}
