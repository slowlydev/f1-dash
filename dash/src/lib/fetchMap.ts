import { MapType } from "@/types/map.type";

export const fetchMap = async (circuitKey: number): Promise<MapType> => {
	const year = new Date().getFullYear();

	const mapRequest = await fetch(`https://api.multiviewer.app/api/v1/circuits/${circuitKey}/${year}`, {
		cache: "no-store",
	});

	const map: MapType = await mapRequest.json();
	return map;
};
