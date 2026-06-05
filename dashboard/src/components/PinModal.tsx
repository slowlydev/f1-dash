'use client';

import { useState, useTransition, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';

import { verifyPin } from '@/app/actions/pin';

export default function PinModal() {
	const router = useRouter();
	const [pin, setPin] = useState('');
	const [error, setError] = useState(false);
	const [isPending, startTransition] = useTransition();

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		setError(false);

		startTransition(async () => {
			const ok = await verifyPin(pin);
			if (ok) {
				router.refresh();
			} else {
				setError(true);
				setPin('');
			}
		});
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ type: 'spring', duration: 0.5 }}
				className="w-full max-w-sm rounded-2xl border border-zinc-700 bg-zinc-900/95 p-8 shadow-2xl backdrop-blur-sm"
			>
				<div className="mb-6 text-center">
					<div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-800">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-7 w-7 text-zinc-300"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={1.5}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
							/>
						</svg>
					</div>

					<h2 className="text-xl font-semibold text-white">Dashboard Locked</h2>
					<p className="mt-1 text-sm text-zinc-400">Enter PIN to access the dashboard</p>
				</div>

				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
					<div>
						<input
							id="pin-input"
							type="password"
							inputMode="numeric"
							autoFocus
							value={pin}
							onChange={(e) => setPin(e.target.value)}
							placeholder="Enter PIN"
							className={`w-full rounded-lg border bg-zinc-800 px-4 py-3 text-center text-lg tracking-widest text-white placeholder-zinc-500 outline-none transition-colors ${
								error ? 'border-red-500/60' : 'border-zinc-700 focus:border-zinc-500'
							}`}
						/>
						{error && <p className="mt-2 text-center text-sm text-red-400">Incorrect PIN</p>}
					</div>

					<motion.button
						type="submit"
						disabled={isPending || !pin}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className="cursor-pointer rounded-lg bg-zinc-700 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-600 disabled:cursor-not-allowed disabled:opacity-40"
					>
						{isPending ? 'Verifying...' : 'Unlock'}
					</motion.button>
				</form>
			</motion.div>
		</div>
	);
}
