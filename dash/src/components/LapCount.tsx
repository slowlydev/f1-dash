import { useDataStore } from "@/stores/useDataStore";

export default function LapCount() {
	const lapCount = useDataStore((state) => state.lapCount);

	return (
		<>
			{!!lapCount && (
				<p className="whitespace-nowrap text-3xl font-extrabold sm:hidden">
					{lapCount?.currentLap} / {lapCount?.totalLaps}
				</p>
			)}
		</>
	);
}
