import type { ReactNode } from "react";


import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

type Props = {
	children: ReactNode;
};

export default function NavLayout({ children }: Props) {
	return (
		<div className="container mx-auto px-4 mt-4">
			<Navbar />

			{children}

			<Footer />
		</div>
	)
}