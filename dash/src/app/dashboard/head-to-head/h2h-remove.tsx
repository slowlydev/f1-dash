import { objectEntries } from "@/lib/driverHelper";

import { useHeadToHeadStore } from "@/stores/useHeadToHeadStore";

import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

type Props = {
	number: "first" | "second";
};

export default function DriverRemove({ number }: Props) {
	const { setFirst, setSecond } = useHeadToHeadStore();

	return <Button onClick={number === "first" ? () => setFirst(null) : () => setSecond(null)}>Remove</Button>;
}
