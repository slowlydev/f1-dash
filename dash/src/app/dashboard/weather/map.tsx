"use client";

import { useEffect, useRef, useState } from "react";

import maplibregl, { Map, Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import { fetchCoords } from "@/lib/geocode";
import { getRainviewer } from "@/lib/rainviewer";

import { useDataStore } from "@/stores/useDataStore";

import PlayControls from "@/components/ui/PlayControls";

import Timeline from "./map-timeline";

export function WeatherMap() {
	const meeting = useDataStore((state) => state?.sessionInfo?.meeting);

	const [loading, setLoading] = useState<boolean>(true);

	const mapContainerRef = useRef<HTMLDivElement>(null);
	const mapRef = useRef<Map>(null);

	const [playing, setPlaying] = useState<boolean>(false);

	const [frames, setFrames] = useState<{ id: number; time: number }[]>([]);
	const currentFrameRef = useRef<number>(0);

	const handleMapLoad = async () => {
		if (!mapRef.current) return;

		const rainviewer = await getRainviewer();
		if (!rainviewer) return;

		const pathFrames = [...rainviewer.radar.past, ...rainviewer.radar.nowcast];

		for (let i = 0; i < pathFrames.length; i++) {
			const frame = pathFrames[i];

			mapRef.current.addLayer({
				id: `rainviewer-frame-${i}`,
				type: "raster",
				source: {
					type: "raster",
					tiles: [`${rainviewer.host}/${frame.path}/256/{z}/{x}/{y}/8/1_0.webp`],
					tileSize: 256,
				},
				paint: {
					"raster-opacity": 0,
					"raster-fade-duration": 200,
					"raster-resampling": "nearest",
				},
			});
		}

		setFrames(pathFrames.map((frame, i) => ({ time: frame.time, id: i })));
	};

	useEffect(() => {
		(async () => {
			if (!mapContainerRef.current) return;

			if (!meeting) return;

			const [coordsC, coordsA] = await Promise.all([
				fetchCoords(`${meeting.country.name}, ${meeting.location} circuit`),
				fetchCoords(`${meeting.country.name}, ${meeting.location} autodrome`),
			]);

			const coords = coordsC || coordsA;

			const libMap = new maplibregl.Map({
				container: mapContainerRef.current,
				style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
				center: coords ? [coords.lon, coords.lat] : undefined,
				zoom: 10,
				canvasContextAttributes: {
					antialias: true,
				},
			});

			libMap.on("load", async () => {
				setLoading(false);

				if (coords) {
					new Marker().setLngLat([coords.lon, coords.lat]).addTo(libMap);
				}

				await handleMapLoad();
			});

			mapRef.current = libMap;
		})();
	}, [meeting]);

	const setFrame = (idx: number) => {
		mapRef.current?.setPaintProperty(`rainviewer-frame-${currentFrameRef.current}`, "raster-opacity", 0);
		mapRef.current?.setPaintProperty(`rainviewer-frame-${idx}`, "raster-opacity", 0.8);
		currentFrameRef.current = idx;
	};

	return (
		<div className="relative h-full w-full">
			<div ref={mapContainerRef} className="absolute h-full w-full" />

			{!loading && frames.length > 0 && (
				<div className="absolute right-0 bottom-0 left-0 z-20 m-2 flex gap-4 rounded-lg bg-black/80 p-4 backdrop-blur-xs md:right-auto md:w-lg">
					<PlayControls playing={playing} onClick={() => setPlaying((v) => !v)} />

					<Timeline frames={frames} setFrame={setFrame} playing={playing} />
				</div>
			)}

			{loading && <div className="h-full w-full animate-pulse rounded-lg bg-zinc-800" />}
		</div>
	);
}
