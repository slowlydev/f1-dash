import { WeatherMap } from "@/app/dashboard/weather/map";

export default function WeatherPage() {
	// calc height is a workaround, maybe think about refactoring sometime
	return (
		<div className="relative h-[calc(100%-142px)] w-full md:h-full">
			<WeatherMap />
		</div>
	);
}
