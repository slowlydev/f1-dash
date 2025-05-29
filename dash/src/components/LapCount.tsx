import { useDataStore } from "@/stores/useDataStore";

export default function LapCount() {
	const lapCount = useDataStore((state) => state.lapCount);

	return (
		<>
			{!!lapCount && (
				<p className="text-3xl font-extrabold whitespace-nowrap sm:hidden">
					{lapCount?.currentLap} / {lapCount?.totalLaps}
				</p>
			)}
		</>
	);
}
