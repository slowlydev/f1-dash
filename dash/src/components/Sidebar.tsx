"use client";

import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

import sidebarIcon from "public/icons/sidebar.svg";

import { useSettingsStore } from "@/stores/useSettingsStore";
import { useSidebarStore } from "@/stores/useSidebarStore";
import { useDataStore } from "@/stores/useDataStore";

import ConnectionStatus from "@/components/ConnectionStatus";
import DelayInput from "@/components/DelayInput";

const liveTimingItems = [
	{
		href: "/dashboard",
		name: "Dashboard",
	},
	{
		href: "/dashboard/track-map",
		name: "Track Map",
	},
	{
		href: "/dashboard/head-to-head",
		name: "Head to Head",
	},
	{
		href: "/dashboard/standings",
		name: "Standings",
	},
];

type Props = {
	connected: boolean;
};

export default function Sidebar({ connected }: Props) {
	const favoriteDrivers = useSettingsStore((state) => state.favoriteDrivers);
	const drivers = useDataStore((state) => state.driverList);
	const sidebarStore = useSidebarStore();

	const driverItems = drivers
		? favoriteDrivers.map((nr) => ({
				href: `dashboard/driver/${nr}`,
				name: drivers[nr].fullName,
			}))
		: null;

	return (
		<motion.nav layoutId="navbar" className="flex w-52 flex-col">
			<div className="flex items-center justify-between gap-2 rounded-lg border border-zinc-800 p-2">
				<DelayInput />

				<ConnectionStatus connected={connected} />

				<button
					className="flex size-12 cursor-pointer items-center justify-center rounded-lg"
					onClick={() => sidebarStore.toggle()}
				>
					<Image src={sidebarIcon} alt="sidebar" />
				</button>
			</div>

			<p className="p-2 text-sm text-zinc-500">Live Timing</p>

			<div className="flex flex-col gap-1">
				{liveTimingItems.map((item) => (
					<Item key={item.href} item={item} />
				))}
			</div>

			<p className="mt-4 p-2 text-sm text-zinc-500">Favorite Drivers</p>

			<div className="flex flex-col gap-1">
				{driverItems === null && (
					<>
						<div className="h-8 animate-pulse rounded-lg bg-zinc-800" />
						<div className="h-8 animate-pulse rounded-lg bg-zinc-800" />
					</>
				)}
				{driverItems?.map((item) => <Item key={item.href} item={item} />)}
			</div>

			<p className="mt-4 p-2 text-sm text-zinc-500">General</p>

			<div className="flex flex-col gap-1">
				<Item target="_blank" item={{ href: "/schedule", name: "Schedule" }} />
				<Item target="_blank" item={{ href: "/settings", name: "Settings" }} />
				<Item target="_blank" item={{ href: "/help", name: "Help" }} />
			</div>

			<p className="mt-4 p-2 text-sm text-zinc-500">Links</p>

			<div className="flex flex-col gap-1">
				<Item target="_blank" item={{ href: "https://github.com/slowlydev/f1-dash", name: "Github" }} />
				<Item target="_blank" item={{ href: "https://discord.gg/unJwu66NuB", name: "Discord" }} />
				<Item target="_blank" item={{ href: "https://buymeacoffee.com/slowlydev", name: "Buy me a coffee" }} />
				<Item target="_blank" item={{ href: "https://github.com/sponsors/slowlydev", name: "Sponsor me" }} />
			</div>
		</motion.nav>
	);
}

type ItemProps = {
	target?: string;
	item: { href: string; name: string };
};

const Item = ({ target, item }: ItemProps) => {
	const active = usePathname() === item.href;

	return (
		<Link href={item.href} target={target}>
			<div
				className={clsx("rounded-lg p-1 px-2 hover:bg-zinc-900", {
					"bg-zinc-800!": active,
				})}
			>
				{item.name}
			</div>
		</Link>
	);
};
