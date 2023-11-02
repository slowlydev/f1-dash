import type { ReactNode } from "react";

type Props = {
	title: string;
	description: string;
	children: ReactNode;
};

export default function HomeFeatureCard({ title, description, children }: Props) {
	return (
		<div className="flex flex-col gap-2 rounded-lg bg-gray-500 bg-opacity-20 p-4">
			<p className="text-lg font-medium leading-none">{title}</p>
			<p className="leading-none text-gray-400">{description}</p>
			<div className="flex gap-2 overflow-scroll rounded-lg bg-zinc-900 p-4">{children}</div>
		</div>
	);
}
