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
	const meeting = useDataStore((state) => state.state?.SessionInfo?.Meeting);

	const [loading, setLoading] = useState<boolean>(true);

	const mapContainerRef = useRef<HTMLDivElement>(null);
	const mapRef = useRef<Map>(null);

	const [playing, setPlaying] = useState<boolean>(false);

	const [frames, setFrames] = useState<{ id: number; time: number }[]>([]);
	const currentFrameRef = useRef<number>(0);

	const handleMapLoad = async (map: Map) => {
		const rainviewer = await getRainviewer();
		if (!rainviewer) return;

		const pathFrames = [...rainviewer.radar.past, ...rainviewer.radar.nowcast];

		for (let i = 0; i < pathFrames.length; i++) {
			const frame = pathFrames[i];

			if (map.getLayer(`rainviewer-frame-${i}`)) {
				continue;
			}

			map.addLayer({
				id: `rainviewer-frame-${i}`,
				type: "raster",
				source: {
					type: "raster",
					tiles: [`${rainviewer.host}${frame.path}/256/{z}/{x}/{y}/8/1_0.webp`],
					tileSize: 256,
				},
				layout: {
					visibility: i <= 1 ? "visible" : "none",
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
		let isMounted = true;
		let mapInstance: Map | null = null;

		(async () => {
			if (!mapContainerRef.current) return;

			if (!meeting) return;

			const [coordsC, coordsA] = await Promise.all([
				fetchCoords(`${meeting.Country.Name}, ${meeting.Location} circuit`),
				fetchCoords(`${meeting.Country.Name}, ${meeting.Location} autodrome`),
			]);

			const coords = coordsC || coordsA;
			if (!isMounted) return;

			const libMap = new maplibregl.Map({
				container: mapContainerRef.current,
				style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
				center: coords ? [coords.lon, coords.lat] : undefined,
				zoom: 6,
				canvasContextAttributes: {
					antialias: true,
				},
			});

			libMap.on("load", async () => {
				if (!isMounted) return;
				setLoading(false);

				if (coords) {
					new Marker().setLngLat([coords.lon, coords.lat]).addTo(libMap);
				}

				await handleMapLoad(libMap);
			});

			mapInstance = libMap;
			mapRef.current = libMap;
		})();

		return () => {
			isMounted = false;
			if (mapInstance) {
				mapInstance.remove();
			}
		};
	}, [meeting]);

	const setFrame = (idx: number) => {
		if (mapRef.current) {
			mapRef.current.setLayoutProperty(`rainviewer-frame-${idx}`, "visibility", "visible");
			
			if (idx + 1 < frames.length) {
				mapRef.current.setLayoutProperty(`rainviewer-frame-${idx + 1}`, "visibility", "visible");
			}

			mapRef.current.setPaintProperty(`rainviewer-frame-${currentFrameRef.current}`, "raster-opacity", 0);
			mapRef.current.setPaintProperty(`rainviewer-frame-${idx}`, "raster-opacity", 0.8);
			
			if (currentFrameRef.current !== idx && currentFrameRef.current !== idx + 1) {
				// Optional: hide old frames if needed, but keeping them visible (with 0 opacity) 
				// allows them to stay cached in Mapbox's render tree without re-requesting if panned.
			}
		}

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
