import Image from "next/image";

import softTireIcon from "public/tires/soft.svg";
import mediumTireIcon from "public/tires/medium.svg";
import hardTireIcon from "public/tires/hard.svg";
import intermediateTireIcon from "public/tires/intermediate.svg";
import wetTireIcon from "public/tires/wet.svg";
import DriverTire from "./DriverTire";

import { exampleDriver } from "@/app/(nav)/help/example-driver";

export default function HelpTires() {
	return (
		<div>
			<h3 className="mt-4 text-2xl font-semibold">
				Tires <span className="text-gray-500">(you probably know them)</span>
			</h3>

			<p>
				In formula 1 there are multiple tires which a drivers/teams can choose from. Below you can learn more about
				them. In the dashboard you will find the culster of infomration about the current tire like shown just right
				below.
			</p>

			<div className="flex items-center gap-2 py-4">
				<div className="w-[9rem]">
					<DriverTire stints={exampleDriver.stints} />
				</div>

				<p className="whitespace-break-spaces text-gray-500">
					The driver is current on a <span className="text-white">used (*)</span>,{" "}
					<span className="text-white">Soft tire (icon)</span>, he has done{" "}
					<span className="text-white">3 Laps (L)</span> on that Tire in the current Stint, also he has{" "}
					<span className="text-white">changed tires 1 time (St.)</span> in this session.
				</p>
			</div>

			<div className="flex flex-col gap-2">
				<div className="flex items-center gap-2">
					<Image src={softTireIcon} alt="soft" className="h-8 w-8" />
					<p>Soft (usually fastest)</p>
				</div>

				<div className="flex items-center gap-2">
					<Image src={mediumTireIcon} alt="medium" className="h-8 w-8" />
					<p>Medium</p>
				</div>

				<div className="flex items-center gap-2">
					<Image src={hardTireIcon} alt="hard" className="h-8 w-8" />
					<p>Hard (usually slower but lasts longer)</p>
				</div>

				<div className="flex items-center gap-2">
					<Image src={intermediateTireIcon} alt="intermediates" className="h-8 w-8" />
					<p>Intermediate (for rain)</p>
				</div>

				<div className="flex items-center gap-2">
					<Image src={wetTireIcon} alt="wets" className="h-8 w-8" />
					<p>Wets (for heavy rain)</p>
				</div>
			</div>
		</div>
	);
}
