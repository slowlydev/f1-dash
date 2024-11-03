import { ModeProvider } from "@/context/ModeContext";
import { type ReactNode } from "react";

type Props = {
	children: ReactNode;
};

export default function ModeLayout({ children }: Props) {
	return <ModeProvider>{children}</ModeProvider>;
}
