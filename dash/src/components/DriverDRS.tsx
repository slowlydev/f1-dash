import clsx from "clsx";

import { DriverType } from "@/types/state.type";

type Props = {
	on: boolean;
	possible: boolean;
	driverStatus: DriverType["status"];
};

export default function DriverDRS({ on, possible, driverStatus }: Props) {
	const pit = driverStatus === "PIT" || driverStatus === "PIT OUT";

	return (
		<span
			className={clsx("text-md inline-flex h-8 w-full items-center justify-center rounded-md border-2 font-black", {
				"border-gray-500 text-gray-500": !pit && !on && !possible,
				"border-gray-300 text-gray-300": !pit && !on && possible,
				"border-emerald-500 text-emerald-500": !pit && on,
				"border-cyan-500 text-cyan-500": pit,
			})}
		>
			{pit ? "PIT" : "DRS"}
		</span>
	);
}
