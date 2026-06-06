import { useDataStore } from "@/stores/useDataStore";

export default function LapCount() {
	const lapCount = useDataStore((state) => state.state?.LapCount);

	return (
		<>
			{!!lapCount && (
				<p className="text-3xl font-extrabold whitespace-nowrap sm:hidden">
					{lapCount?.CurrentLap} / {lapCount?.TotalLaps}
				</p>
			)}
		</>
	);
}
