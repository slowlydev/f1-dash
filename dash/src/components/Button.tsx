import clsx from "clsx";
import type { ReactNode } from "react";

type Props = {
	children: ReactNode;
	onClick?: () => void;
	className?: string;
};

export default function Button({ children, onClick, className }: Props) {
	// TODO add hover effect
	return (
		<button
			className={clsx(className, "rounded-lg border-[1px] border-gray-500 bg-zinc-900 p-2 px-3 text-center")}
			onClick={onClick}
		>
			{children}
		</button>
	);
}
