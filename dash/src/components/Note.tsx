import { type ReactNode } from "react";
import Image from "next/image";
import clsx from "clsx";

import infoIcon from "public/icons/info.svg";

type Props = {
	className?: string;
	children: ReactNode;
};

export default function Note({ children, className }: Props) {
	return (
		<div className={clsx("flex flex-col border-l-4 border-blue-500 py-2 pl-4", className)}>
			<div className="flex items-center gap-2">
				<Image src={infoIcon} className="size-4" alt={"info icon"} />
				<p className="text-blue-500">Note</p>
			</div>
			<p>{children}</p>
		</div>
	);
}
