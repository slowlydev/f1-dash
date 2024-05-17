import { LapCount as LapCountType } from "@/types/state.type";

type Props = {
	lapCount: LapCountType | undefined;
};

export default function LapCount({ lapCount }: Props) {
	return (
		<>
			{!!lapCount && (
				<p className="whitespace-nowrap text-3xl font-extrabold sm:hidden">
					{lapCount?.currentLap} / {lapCount?.totalLaps}
				</p>
			)}
		</>
	);
}
