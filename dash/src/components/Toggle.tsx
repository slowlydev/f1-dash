"use client";

import { useSettingsStore } from "@/stores/useSettingsStore";
import { Switch } from "@headlessui/react";
import clsx from "clsx";

type Props = {
	enabled: boolean;
	setEnabled: (value: boolean) => void;
};

export default function Toggle({ enabled, setEnabled }: Props) {
	const darkMode = useSettingsStore((state) => state.darkMode);

	return (
		<Switch.Group as="div" className="">
			<Switch
				checked={enabled}
				onChange={setEnabled}
				className={clsx(
					enabled ? "bg-indigo-500" : `${darkMode ? "bg-primary-dark" : "bg-primary-light"}`,
					"relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
				)}
			>
				<span
					aria-hidden="true"
					className={clsx(
						enabled ? "translate-x-5" : "translate-x-0",
						"pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
					)}
				/>
			</Switch>
		</Switch.Group>
	);
}
