import Image from "next/image";

import type { DriverType } from "../types/driver.type";

type Props = {
	driver: DriverType;
};

export default function HeadToHeadDriver({ driver }: Props) {
	return (
		<div>
			<div>
				<Image src={driver.image} alt={driver.firstName} width={200} height={200} />
				<div>
					<p>
						{driver.firstName} {driver.lastName}
					</p>
					<p>{driver.teamName}</p>
				</div>

				<pre className="whitespace-pre-wrap">{JSON.stringify(driver)}</pre>
			</div>
		</div>
	);
}
