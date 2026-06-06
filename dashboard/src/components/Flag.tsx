import { clsx } from "clsx";
import Image from "next/image";

type Props = {
	countryCode: string | undefined;
	className?: string;
};

export default function Flag({ countryCode, className }: Props) {
	return (
		<div className={clsx("flex h-12 w-16 content-center justify-center", className)}>
			{countryCode ? (
				<Image
					src={`/country-flags/${countryCode.toLowerCase()}.${"svg"}`}
					alt={countryCode}
					width={64}
					height={48}
					className="overflow-hidden rounded-lg"
				/>
			) : (
				<div className="h-full w-full animate-pulse overflow-hidden rounded-lg bg-zinc-800" />
			)}
		</div>
	);
}
