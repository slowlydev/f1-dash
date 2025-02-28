import Link from "next/link";

import Button from "@/components/ui/Button";

export default function NotFound() {
	return (
		<div className="container mx-auto max-w-(--breakpoint-lg) px-4">
			<section className="flex h-screen w-full flex-col items-center pt-20 sm:justify-center sm:pt-0">
				<p className="text-center text-8xl font-bold">404</p>

				<h1 className="my-20 text-center text-5xl font-bold">Page not found</h1>

				<div className="flex flex-wrap gap-4">
					<Link href="/">
						<Button className="rounded-xl! border-2 border-zinc-700 bg-transparent! p-4 font-medium">
							Go back to home
						</Button>
					</Link>
				</div>
			</section>
		</div>
	);
}
