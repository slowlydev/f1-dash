import { type ReactNode } from 'react';
import { cookies } from 'next/headers';

import DashboardClientLayout from './DashboardClientLayout';
import PinModal from '@/components/PinModal';

type Props = {
	children: ReactNode;
};

export default async function DashboardLayout({ children }: Props) {
	const requiredPin = process.env.DASHBOARD_PIN;

	// If DASHBOARD_PIN is not set, bypass PIN protection entirely.
	if (!requiredPin) {
		return <DashboardClientLayout>{children}</DashboardClientLayout>;
	}

	// PIN is configured — check the cookie.
	const cookieStore = await cookies();
	const pinCookie = cookieStore.get('f1-dash-pin');
	const isAuthenticated = pinCookie?.value === requiredPin;

	if (isAuthenticated) {
		return <DashboardClientLayout>{children}</DashboardClientLayout>;
	}

	// Not authenticated — show blurred placeholder + PIN modal.
	return (
		<div className="relative h-screen w-full overflow-hidden">
			{/* Blurred dummy background that hints at the dashboard UI */}
			<div className="pointer-events-none absolute inset-0 select-none blur-xl brightness-50">
				<div className="flex h-full w-full md:pt-2 md:pr-2 md:pb-2">
					{/* Fake sidebar */}
					<div className="hidden h-full w-56 shrink-0 border-r border-zinc-800 md:block" />

					<div className="flex h-full w-full flex-1 flex-col gap-2 p-2">
						{/* Fake top bar */}
						<div className="h-12 w-full rounded-lg border border-zinc-800 bg-zinc-900" />

						{/* Fake content grid */}
						<div className="flex flex-1 gap-2">
							<div className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900/60" />
							<div className="hidden w-80 rounded-lg border border-zinc-800 bg-zinc-900/40 2xl:block" />
						</div>

						{/* Fake bottom panels */}
						<div className="grid grid-cols-3 gap-2">
							<div className="h-40 rounded-lg border border-zinc-800 bg-zinc-900/50" />
							<div className="h-40 rounded-lg border border-zinc-800 bg-zinc-900/50" />
							<div className="h-40 rounded-lg border border-zinc-800 bg-zinc-900/50" />
						</div>
					</div>
				</div>
			</div>

			<PinModal />
		</div>
	);
}
