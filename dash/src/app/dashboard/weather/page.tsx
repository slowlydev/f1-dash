import { WeatherMap } from "@/app/dashboard/weather/map";

import { env } from "@/env";

export default function WeatherPage() {
	return (
		<div className="relative h-full w-full">
			{!!env.NEXT_PUBLIC_MAP_KEY ? (
				<WeatherMap />
			) : (
				<div className="flex h-full w-full flex-col items-center justify-center">
					<p>weather map unavailable</p>
					<p className="text-sm text-zinc-500">setup the map key to the use the weather map</p>
				</div>
			)}
		</div>
	);
}
