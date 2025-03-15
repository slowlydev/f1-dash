"use client";

import { useEffect, useRef, useState } from "react";

import maplibregl, { Map } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import { env } from "@/env";

import type { MapItem, Rainviewer } from "@/types/rainviewer.type";

import { fetchCoords } from "@/lib/geocode";
import { getRainviewer } from "@/lib/rainviewer";

import { useDataStore } from "@/stores/useDataStore";

export function WeatherMap() {
	const meeting = useDataStore((state) => state?.sessionInfo?.meeting);

	const [loading, setLoading] = useState<boolean>(true);

	const mapContainerRef = useRef<HTMLDivElement>(null);
	const mapRef = useRef<Map>(null);

	const framesRef = useRef<MapItem[]>([]);
	const currentFrameRef = useRef<number>(0);

	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	const updateFrameVisibility = () => {
		const currentFrameIndex = currentFrameRef.current;
		const nextFrameIndex = (currentFrameIndex + 1) % framesRef.current.length;

		// mapRef.current?.setLayoutProperty(`rainviewer-frame-${currentFrameIndex}`, "visibility", "none");
		// mapRef.current?.setLayoutProperty(`rainviewer-frame-${nextFrameIndex}`, "visibility", "visible");

		mapRef.current?.setPaintProperty(`rainviewer-frame-${currentFrameIndex}`, "raster-opacity", 0);
		mapRef.current?.setPaintProperty(`rainviewer-frame-${nextFrameIndex}`, "raster-opacity", 0.8);

		currentFrameRef.current = nextFrameIndex;
	};

	const handleMapLoad = async () => {
		if (!mapRef.current) return;

		const rainviewer = await getRainviewer();
		if (!rainviewer) return;

		framesRef.current = [...rainviewer.radar.past, ...rainviewer.radar.nowcast];

		for (let i = 0; i < framesRef.current.length; i++) {
			const frame = framesRef.current[i];

			mapRef.current.addLayer({
				id: `rainviewer-frame-${i}`,
				type: "raster",
				source: {
					type: "raster",
					tiles: [`${rainviewer.host}/${frame.path}/256/{z}/{x}/{y}/8/1_0.webp`],
					tileSize: 256,
				},
				// layout: {
				// 	visibility: "none",
				// },
				paint: {
					"raster-opacity": 0,
					"raster-fade-duration": 200,
					"raster-resampling": "nearest",
				},
			});
		}

		intervalRef.current = setInterval(updateFrameVisibility, 1000);
	};

	useEffect(() => {
		(async () => {
			if (!mapContainerRef.current) return;

			if (!meeting) return;

			const coords = await fetchCoords(`${meeting.country.name}, ${meeting.location}`);
			if (!coords) {
				console.error("no coords found");
				return;
			}

			const libMap = new maplibregl.Map({
				container: mapContainerRef.current,
				style: `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${env.NEXT_PUBLIC_MAP_KEY}`,
				center: [coords.lon, coords.lat],
				zoom: 10,
				canvasContextAttributes: {
					antialias: true,
				},
			});

			libMap.on("load", async () => {
				setLoading(false);
				await handleMapLoad();
			});

			mapRef.current = libMap;
		})();

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [meeting]);

	return (
		<div className="relative h-full w-full">
			<div ref={mapContainerRef} className="absolute h-full w-full" />

			{loading && <div className="h-full w-full animate-pulse rounded-lg bg-zinc-800" />}
		</div>
	);
}
