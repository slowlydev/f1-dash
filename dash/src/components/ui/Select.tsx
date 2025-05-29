"use client";

import { useState } from "react";
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react";
import clsx from "clsx";
import { BiChevronDown } from "react-icons/bi";

type Option<T> = {
	value: T;
	label: string;
};

type Props<T> = {
	placeholder?: string;
	options: Option<T>[];
	selected: T | null;
	setSelected: (value: T | null) => void;
};

export default function Select<T>({ placeholder, options, selected, setSelected }: Props<T>) {
	const [query, setQuery] = useState("");

	const selectedOption = options.find((option) => option.value === selected);

	const filteredOptions =
		query === "" ? options : options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()));

	return (
		<Combobox value={selected} onChange={setSelected} nullable>
			<div className="relative">
				<div className="relative w-full rounded-lg bg-zinc-800">
					<ComboboxInput
						className="w-full rounded-lg border-none bg-zinc-800 py-1.5 pr-8 pl-3 text-sm/6 text-white focus:outline-none"
						displayValue={() => selectedOption?.label || ""}
						placeholder={placeholder || "Select option"}
						onChange={(event) => setQuery(event.target.value)}
					/>
					<ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
						<BiChevronDown className="h-5 w-5 text-zinc-400" aria-hidden="true" />
					</ComboboxButton>
				</div>
				<ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-zinc-800 py-1 text-sm shadow-lg focus:outline-none">
					{filteredOptions.map((option, index) => (
						<ComboboxOption
							key={index}
							value={option.value}
							className={({ active, selected }) =>
								clsx(
									"relative cursor-default py-2 pr-9 pl-3 select-none",
									active ? "bg-zinc-700 text-white" : "text-zinc-300",
									selected && "bg-zinc-700",
								)
							}
						>
							{option.label}
						</ComboboxOption>
					))}
				</ComboboxOptions>
			</div>
		</Combobox>
	);
}
