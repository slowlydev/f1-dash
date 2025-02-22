import Image from "next/image";

import Gauge from "./Gauge";

import humidityIcon from "public/icons/humidity.svg";

type Props = {
	value: number;
};

export default function HumidityComplication({ value }: Props) {
	return (
		<div className="relative flex h-[55px] w-[55px] items-center justify-center rounded-full bg-black">
			<Gauge value={value} max={100} gradient="humidity" />

			<div className="mt-2 flex flex-col items-center gap-0.5">
				<p className="flex h-[22px] shrink-0 text-xl leading-[normal] font-medium text-[color:var(--Base-Text,#F2F2F2)] not-italic">
					{value}
				</p>
				<Image src={humidityIcon} alt="humidity icon" className="h-[11px] w-auto" />
			</div>
		</div>
	);
}
