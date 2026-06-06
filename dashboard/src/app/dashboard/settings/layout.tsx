import type { ReactNode } from "react";

type Props = Readonly<{
	children: ReactNode;
}>;

export default function Layout({ children }: Props) {
	return <div className="max-w-(--breakpoint-lg) p-4">{children}</div>;
}
