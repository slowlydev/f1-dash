import clsx from "clsx";

type Props = {
	connected: boolean;
};

export default function ConnectionStatus({ connected }: Props) {
	return <div className={clsx("h-4 w-4 rounded-full", connected ? "bg-emerald-500" : "bg-red-500")} />;
}
