import Image from "next/image";

import softTireIcon from "public/tires/soft.svg";
import mediumTireIcon from "public/tires/medium.svg";
import hardTireIcon from "public/tires/hard.svg";
import intermediateTireIcon from "public/tires/intermediate.svg";
import wetTireIcon from "public/tires/wet.svg";

export default function HelpTires() {
	return (
		<div>
			<h3 className="mt-4 text-2xl font-semibold">
				Tires <span className="text-gray-500">(you probably know them)</span>
			</h3>

			<div className="flex flex-col gap-2">
				<div className="flex items-center gap-2">
					<Image src={softTireIcon} alt="soft" className="h-10 w-10" />
					<p>Soft (usually fastest)</p>
				</div>

				<div className="flex items-center gap-2">
					<Image src={mediumTireIcon} alt="medium" className="h-10 w-10" />
					<p>Medium</p>
				</div>

				<div className="flex items-center gap-2">
					<Image src={hardTireIcon} alt="hard" className="h-10 w-10" />
					<p>Hard (usually slower but lasts longer)</p>
				</div>

				<div className="flex items-center gap-2">
					<Image src={intermediateTireIcon} alt="intermediates" className="h-10 w-10" />
					<p>Intermediate (for rain)</p>
				</div>

				<div className="flex items-center gap-2">
					<Image src={wetTireIcon} alt="wets" className="h-10 w-10" />
					<p>Wets (for heavy rain)</p>
				</div>
			</div>
		</div>
	);
}
