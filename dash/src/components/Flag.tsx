import Image from "next/image";

type Props = {
	countryCode: string | undefined;
	width: number | undefined;
	height: number | undefined;
};

export default function Flag({ countryCode, width, height }: Props) {
	return (
		<div className="flex content-center justify-center">
			{countryCode ? (
				<Image
					src={`/country-flags/${countryCode.toLowerCase()}.${"svg"}`}
					alt={countryCode}
					width={width}
					height={height}
					className="overflow-hidden rounded-lg"
				/>
			) : (
				<div className="h-full w-full animate-pulse overflow-hidden rounded-lg bg-zinc-800" />
			)}
		</div>
	);
}
