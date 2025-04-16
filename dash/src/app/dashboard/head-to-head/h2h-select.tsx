import { objectEntries } from "@/lib/driverHelper";

import { useDataStore } from "@/stores/useDataStore";
import { useHeadToHeadStore } from "@/stores/useHeadToHeadStore";

import Select from "@/components/ui/Select";

type Props = {
	number: "first" | "second";
};

export default function DriverSelect({ number }: Props) {
	const drivers = useDataStore((s) => s.driverList);

	const { first, second, setFirst, setSecond } = useHeadToHeadStore();

	if (!drivers) return null;

	return (
		<Select
			placeholder={`Search & Select a driver`}
			options={objectEntries(drivers)
				.map((driver) => ({
					value: driver.racingNumber,
					label: driver.fullName,
				}))
				.filter((driver) => driver.value !== (number === "first" ? second : first))}
			selected={number === "first" ? first : second}
			setSelected={(v) => (number === "first" ? setFirst(v) : setSecond(v))}
		/>
	);
}
