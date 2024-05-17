"use client";

import { AnimatePresence } from "framer-motion";
import { type ReactNode } from "react";
import Image from "next/image";

import infoIcon from "public/icons/info.svg";

type Props = {
	children: ReactNode;
	show: boolean;
	elementChildren?: boolean;
};

export default function InfoPopover({ children, show, elementChildren = false }: Props) {
	return (
		<AnimatePresence>
			{show && (
				<div className="flex gap-2 rounded-2xl bg-popover p-2 bg-blend-overlay backdrop-blur-3xl">
					<Image src={infoIcon} alt="info" className="m-2 h-6 w-6" />

					<div className="flex flex-col items-center justify-center gap-2">
						{elementChildren ? children : <p className="font-medium text-white">{children}</p>}
					</div>
				</div>
			)}
		</AnimatePresence>
	);
}
