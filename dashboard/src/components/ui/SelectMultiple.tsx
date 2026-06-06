"use client";

import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react";
import { useState } from "react";
import clsx from "clsx";

type Option<T> = {
	value: T;
	label: string;
};

type Props<T> = {
	placeholder?: string;

	options: Option<T>[];

	selected: T[];
	setSelected: (value: T[]) => void;
};

export default function SelectMultiple<T>({ placeholder, options, selected, setSelected }: Props<T>) {
	const [query, setQuery] = useState("");

	const filteredOptions =
		query === "" ? options : options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()));

	return (
		<Combobox value={selected} onChange={(value) => setSelected(value)} onClose={() => setQuery("")} multiple>
			<div className="relative">
				<ComboboxInput
					placeholder={placeholder}
					className={clsx(
						"w-full rounded-lg border-none bg-zinc-900 py-1.5 pr-8 pl-3 text-sm/6 text-white",
						"focus:outline-hidden data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-zinc-700",
					)}
					displayValue={(option: Option<T> | null) => option?.label ?? ""}
					onChange={(event) => setQuery(event.target.value)}
				/>
				<ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
					{/* <ChevronDownIcon className="size-4 fill-white/60 group-data-hover:fill-white" /> */}
				</ComboboxButton>
			</div>

			<ComboboxOptions
				anchor="bottom"
				className={clsx(
					"w-[var(--input-width)] rounded-xl border border-white/5 bg-zinc-900 p-1 [--anchor-gap:var(--spacing-1)] empty:invisible",
					"z-50 mt-1 transition duration-100 ease-in data-leave:data-closed:opacity-0",
				)}
			>
				{filteredOptions.slice(0, 5).map((option, idx) => (
					<ComboboxOption
						key={idx}
						value={option.value}
						className="group flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-white/10"
					>
						{/* <CheckIcon className="invisible size-4 fill-white group-data-selected:visible" /> */}
						<div className="text-sm/6 text-white">{option.label}</div>
					</ComboboxOption>
				))}
			</ComboboxOptions>
		</Combobox>
	);
}
