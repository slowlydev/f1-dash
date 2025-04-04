"use client";
import { Suspense } from "react";

import Footer from "@/components/Footer";

import NextRound from "@/components/schedule/NextRound";
import FullSchedule from "@/components/schedule/FullSchedule";
import { useSettingsStore } from "@/stores/useSettingsStore";

export default async function SchedulePage() {
	const darkMode = useSettingsStore((state) => state.darkMode);
	return (
		<div
			className={`min-h-screen w-full ${darkMode ? "bg-background-dark text-white" : "bg-background-light text-black"}`}
		>
			<div className={"container mx-auto max-w-screen-lg px-4"}>
				<div className="my-4">
					<h1 className="text-3xl">Up Next</h1>
					<p className={`${darkMode ? "text-tertiary-dark" : "text-tertiary-light"}`}>All times are local time</p>
				</div>

				<Suspense fallback={<NextRoundLoading />}>
					<NextRound />
				</Suspense>

				<div className="my-4">
					<h1 className="text-3xl">Schedule</h1>
					<p className={`${darkMode ? "text-tertiary-dark" : "text-tertiary-light"}`}>All times are local time</p>
				</div>

				<Suspense fallback={<FullScheduleLoading />}>
					<FullSchedule />
				</Suspense>

				<Footer />
			</div>
		</div>
	);
}

const RoundLoading = () => {
	const darkMode = useSettingsStore((state) => state.darkMode);
	return (
		<div className="flex flex-col gap-1">
			<div
				className={`h-12 w-full animate-pulse rounded-md ${darkMode ? "bg-primary-dark text-black" : "bg-primary-light text-black"}`}
			/>

			<div className="grid grid-cols-3 gap-8 pt-1">
				{Array.from({ length: 3 }).map((_, i) => (
					<div key={`day.${i}`} className="grid grid-rows-2 gap-2">
						<div
							className={`h-12 w-full animate-pulse rounded-md ${darkMode ? "bg-primary-dark" : "bg-primary-light"}`}
						/>
						<div
							className={`h-12 w-full animate-pulse rounded-md ${darkMode ? "bg-primary-dark" : "bg-primary-light"}`}
						/>
					</div>
				))}
			</div>
		</div>
	);
};

const NextRoundLoading = () => {
	const darkMode = useSettingsStore((state) => state.darkMode);
	return (
		<div className="grid h-44 grid-cols-1 gap-8 sm:grid-cols-2">
			<div className="flex flex-col gap-4">
				<div className={`h-1/2 w-3/4 animate-pulse rounded-md ${darkMode ? "bg-primary-dark" : "bg-primary-light"}`} />
				<div className={`h-1/2 w-3/4 animate-pulse rounded-md ${darkMode ? "bg-primary-dark" : "bg-primary-light"}`} />
			</div>

			<RoundLoading />
		</div>
	);
};

const FullScheduleLoading = () => {
	return (
		<div className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-2">
			{Array.from({ length: 6 }).map((_, i) => (
				<RoundLoading key={`round.${i}`} />
			))}
		</div>
	);
};
