import { buildParams } from "@/lib/params";

import type { Coords, Place } from "@/types/geocode.type";

export const fetchCoords = async (query: string): Promise<Coords | null> => {
	const params = buildParams({
		q: query,
		format: "jsonv2",
	});

	const url = `https://nominatim.openstreetmap.org/search${params}`;

	const response = await fetch(url);
	const data: Place[] = await response.json();

	if (response.ok && data.length > 0) {
		const sorted = data.sort((a, b) => b.importance - a.importance);

		const { lon, lat } = sorted[0];
		return { lon: parseFloat(lon), lat: parseFloat(lat) };
	}

	return null;
};
