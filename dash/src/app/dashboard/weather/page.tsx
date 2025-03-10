import { WeatherMap } from "@/app/dashboard/weather/map";

export default function WeatherPage() {
	return (
		<div className="flex h-full divide-x divide-zinc-800">
			<WeatherMap />
		</div>
	);
}
