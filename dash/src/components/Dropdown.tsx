"use client";

import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import clsx from "clsx";
import Image from "next/image";

import chevronDownIcon from "@/public/icons/chevron-down.svg";

type Props<T> = {
	label: string;
	options: T[];
	selected?: T;
	// onSelect: (value: T) => void;
};

export default function Dropdown<T>({ options, selected, label }: Props<T>) {
	const onSelect = (d: T) => {
		console.log(d);
	};

	return (
		<Menu as="div" className="relative inline-block text-left">
			<div>
				<Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-zinc-700 px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-zinc-600 hover:bg-zinc-500">
					{selected ? `${selected}` : label}
					<Image src={chevronDownIcon} alt="down arrow" className="-mr-1 h-5 w-5" aria-hidden="true" />
				</Menu.Button>
			</div>

			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<Menu.Items className="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-zinc-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div className="max-h-48 overflow-scroll py-1">
						{options.map((option) => (
							<Menu.Item>
								{({ active }) => (
									<p
										onClick={() => onSelect(option)}
										className={clsx(active && "bg-zinc-600", "block px-4 py-2 text-sm")}
									>
										{option === new Date().getFullYear() ? `${option} (Current Year)` : `${option}`}
									</p>
								)}
							</Menu.Item>
						))}
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	);
}
