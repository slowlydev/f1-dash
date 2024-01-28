import type { ReactNode } from "react";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

type Props = {
	children: ReactNode;
};

export default function NavLayout({ children }: Props) {
	return (
		<div className="container mx-auto mt-4 px-4">
			<Navbar />

			{children}

			<Footer />
		</div>
	);
}
