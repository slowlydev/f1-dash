"use client";

import Image from "next/image";

import helpDriverImage from "public/help-driver.png";

import HelpColors from "@/components/HelpColors";
import HelpTires from "@/components/HelpTires";
import HelpDelay from "@/components/HelpDelay";
import HelpDRS from "@/components/HelpDRS";

export default function Page() {
	return (
		<div className="mt-4">
			<h1 className="mb-2 text-3xl font-extrabold">Help</h1>

			<p>
				Do you feel overwhelmed or don't understand the data? <br />
				Then this is your page! It explains the what what is, when it changes, how it can change <br /> and the meaning
				of the different colors.
			</p>

			<h3 className="mt-4 text-2xl font-semibold">The Leader board</h3>

			<Image src={helpDriverImage} alt="driver with help" />

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<HelpDRS />
				<HelpColors />
				<HelpTires />
				<HelpDelay />
			</div>
		</div>
	);
}
