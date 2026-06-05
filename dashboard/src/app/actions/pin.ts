'use server';

import { cookies } from 'next/headers';

export async function verifyPin(pin: string): Promise<boolean> {
	const expected = process.env.DASHBOARD_PIN;

	// Safety fallback: if the env var is not set, always grant access.
	// This should never be called in practice when the var is unset,
	// because the layout won't render the PinModal.
	if (!expected) return true;

	if (pin !== expected) return false;

	const cookieStore = await cookies();
	cookieStore.set('f1-dash-pin', expected, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		maxAge: 60 * 60 * 24 * 3, // 3 days
		path: '/',
	});

	return true;
}
