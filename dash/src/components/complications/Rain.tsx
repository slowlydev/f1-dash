import Image from "next/image";

import rainIcon from "public/icons/cloud.heavyrain.svg";
import noRainIcon from "public/icons/cloud.rain.svg";

type Props = {
	rain: boolean;
};

export default function RainComplication({ rain }: Props) {
	return (
		<div className="relative flex h-[55px] w-[55px] items-center justify-center rounded-full bg-black">
			{rain ? (
				<Image src={rainIcon} alt="rain" className="h-[25px] w-auto" />
			) : (
				<Image src={noRainIcon} alt="no rain" className="h-[25px] w-auto" />
			)}
		</div>
	);
}
