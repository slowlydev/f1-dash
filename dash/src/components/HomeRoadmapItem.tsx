import type { ReactNode } from "react";
import clsx from "clsx";

type Props = {
	children: ReactNode;
	classNames?: string;
};

export default function HomeRoadmapItem({ children, classNames }: Props) {
	return (
		<div className={clsx(classNames, " w-max rounded-lg bg-slate-800 p-2")}>
			<p>{children}</p>
		</div>
	);
}
