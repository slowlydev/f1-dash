import clsx from "clsx";

type Props = {
	live: boolean;
	replay?: boolean;
};

export default function StreamStatus({ live, replay }: Props) {
	return (
		<div className="flex items-center justify-center gap-1">
			<div className={clsx("size-3 rounded-full", live ? "bg-red-500" : "bg-zinc-500")} />
			<p className={clsx("font-semibold leading-none", live ? "text-red-500" : "text-zinc-500")}>
				{!replay ? "Live" : "Replay"}
			</p>
		</div>
	);
}
