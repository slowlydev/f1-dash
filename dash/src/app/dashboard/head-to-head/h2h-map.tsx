import { useCarDataStore } from "@/stores/useDataStore";

import DriverSpeedometer from "@/components/driver/DriverSpeedometer";
import Map from "@/components/dashboard/Map";

type Props = {
	first: string | null;
	second: string | null;
};

export default function HeadToHeadMap({ first, second }: Props) {
	const carDataFirst = useCarDataStore((state) => (first ? state?.carsData?.[first].Channels : undefined));
	const carDataSecond = useCarDataStore((state) => (second ? state.carsData?.[second].Channels : undefined));

	const mapFilter = [first, second].filter(Boolean) as string[];

	return (
		<div className="flex w-full items-center justify-center">
			<div className="relative">{carDataFirst && <DriverSpeedometer carData={carDataFirst} />}</div>

			<div className="w-96">
				<Map filter={mapFilter} />
			</div>

			<div className="relative">{carDataSecond && <DriverSpeedometer carData={carDataSecond} />}</div>
		</div>
	);
}
