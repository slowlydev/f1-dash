"use client";

import { AnimatePresence } from "framer-motion";
import Image from "next/image";

import infoIcon from "public/icons/info.svg";
import { ReactNode } from "react";
import Button from "./Button";

type Props = {
	children: ReactNode;
	show: boolean;

	onNext?: () => void;
	nextLabel?: string;
};

export default function InfoPopover({ children, show, onNext, nextLabel }: Props) {
	return (
		<AnimatePresence>
			{show && (
				<div className="absolute z-40 -ml-[2px]">
					<Tip className="ml-[6px]" />
					<div className="flex gap-4 rounded-2xl bg-popover p-4 bg-blend-overlay backdrop-blur-3xl">
						<Image src={infoIcon} alt="info" className="h-6 w-6" />

						<div className="flex flex-col items-center justify-center gap-4">
							<p className="font-medium text-white">{children}</p>
							{nextLabel && <Button>{nextLabel}</Button>}
						</div>
					</div>
				</div>
			)}
		</AnimatePresence>
	);
}

type TipProps = {
	className?: string;
};

function Tip({ className }: TipProps) {
	return (
		<svg
			width="47"
			height="13"
			viewBox="0 0 47 13"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
		>
			<path
				d="M0 12.9981C1.71249 12.9981 3.42448 13.0066 5.13697 12.9881C6.77598 12.9701 8.61044 12.9445 10.2055 12.343C11.9284 11.693 13.0691 10.5565 14.2168 9.21897C15.043 8.25695 16.666 6.20441 17.4563 5.21339C18.1031 4.40087 19.3692 2.79483 20.0605 2.01782C20.9308 1.0403 22.0064 0.00127411 23.5005 0.00127411C24.9946 0.00127411 26.0697 1.0403 26.9395 2.01682C27.6308 2.79333 28.8969 4.40037 29.5442 5.21239C30.3335 6.20341 31.9565 8.25595 32.7832 9.21797C33.9329 10.5555 35.0716 11.692 36.794 12.342C38.3896 12.942 40.2245 12.9691 41.8625 12.9871C43.5755 13.0056 45.2875 12.9971 47 12.9971"
				fill="#252525"
				fillOpacity="0.9"
			/>
		</svg>
	);
}
