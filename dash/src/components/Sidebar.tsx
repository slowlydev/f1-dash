"use client";

import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import Link from "next/link";
import clsx from "clsx";

import { useSettingsStore } from "@/stores/useSettingsStore";
import { useSidebarStore } from "@/stores/useSidebarStore";
import { useDataStore } from "@/stores/useDataStore";

import ConnectionStatus from "@/components/ConnectionStatus";
import DelayInput from "@/components/DelayInput";
import SidenavButton from "@/components/SidenavButton";

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
	const delay = useSettingsStore((state) => state.delay);
	const favoriteDrivers = useSettingsStore((state) => state.favoriteDrivers);
	const drivers = useDataStore((state) => state.driverList);

	const driverItems = drivers
		? favoriteDrivers.map((nr) => ({
				href: `dashboard/driver/${nr}`,
				name: drivers[nr].fullName,
			}))
		: null;

	const { opened, pinned } = useSidebarStore();
	const close = useSidebarStore((state) => state.close);
	const open = useSidebarStore((state) => state.open);

	const pin = useSidebarStore((state) => state.pin);
	const unpin = useSidebarStore((state) => state.unpin);

	return (
		<div>
			<motion.div style={{ width: 216 }} animate={{ width: pinned ? 216 : 8 }} />

			<p className="fixed top-0 right-0 z-50">
				{pinned ? "pinned" : "not pinned"}
				{opened ? "opened" : "closed"}
			</p>

			<motion.div
				className="fixed top-0 bottom-0 left-0 z-40 flex"
				//
				onHoverEnd={!pinned ? () => close() : undefined}
				onHoverStart={!pinned ? () => open() : undefined}
				//
				animate={{ left: pinned || opened ? 0 : -216 }}
				transition={{ type: "spring", bounce: 0.18 }}
			>
				<nav
					className={clsx("m-2 flex w-52 flex-col bg-zinc-950 p-2", {
						"rounded-lg border border-zinc-800": !pinned,
					})}
				>
					<div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-2">
							<DelayInput />

							<p className={clsx("rounded-lg p-1 px-2 text-sm", delay > 0 ? "bg-gray-600" : "bg-red-700")}>
								{delay > 0 ? "Delayed" : "Live"}
							</p>
						</div>

						<SidenavButton onClick={() => (pinned ? unpin() : pin())} />
					</div>

					<div className="flex items-center gap-2 p-1">
						<ConnectionStatus connected={connected} />
						<p className="text-sm text-zinc-500">3'000 Users</p>
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
				</nav>
			</motion.div>
		</div>
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
