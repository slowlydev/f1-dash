import { useCustomUIStore, type Stack } from "@/stores/useCustomUIStore";
import { clsx } from "clsx";
import { ReactNode } from "react";

export default function CustomUI() {
	const tree = useCustomUIStore((state) => state.tree);

	if (!tree) return null;

	return <Stack stack={tree} />;
}

const Stack = ({ stack }: { stack: Stack }) => {
	return (
		<div className={clsx("flex", stack.direction === "row" ? "flex-row" : "flex-col")}>
			{stack.items.map((item): ReactNode => {
				if (item instanceof Stack) {
					return <Stack stack={item as Stack} />;
				}

				return item as ReactNode;
			})}
		</div>
	);
};
