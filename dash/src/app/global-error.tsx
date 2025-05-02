"use client";

import Button from "@/components/ui/Button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	return (
		<div className="flex h-dvh w-full flex-col items-center justify-center">
			<h2>Something went wrong!</h2>
			<p>{error.message}</p>
			<Button onClick={() => reset()}>Try again</Button>
		</div>
	);
}
