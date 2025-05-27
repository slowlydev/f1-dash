import clsx from "clsx";

type Props = {
	old: number;
	current: number;
};

export default function NumberDiff({ old, current }: Props) {
	const positionChange = old - current;
	const gain = positionChange > 0;
	const loss = positionChange < 0;

	return (
		<p
			className={clsx({
				"text-emerald-500": gain,
				"text-red-500": loss,
				"text-zinc-500": !gain && !loss,
			})}
		>
			{gain ? `+${positionChange}` : loss ? positionChange : "-"}
		</p>
	);
}
