import { useDataStore } from "@/stores/useDataStore";

export default function LapCount() {
	const lapCount = useDataStore((state) => state?.lapCount);

	if (!lapCount) return null;

	return (
		<p className="whitespace-nowrap text-lg">
			{lapCount?.currentLap} / {lapCount?.totalLaps}
		</p>
	);
}
