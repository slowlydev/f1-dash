import { env } from "@/env.mjs";
import { Meeting } from "@/types/archive.type";
import { ReactNode } from "react";

const getArchiveForYear = async (year: string): Promise<Meeting[] | null> => {
	try {
		const nextReq = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/archive/${year}`, {
			next: { revalidate: 60 * 60 * 4 },
		});
		const schedule: Meeting[] = await nextReq.json();
		return schedule;
	} catch (e) {
		return null;
	}
};

export default async function ArchiveLayout({
	children,
	params,
}: {
	children: ReactNode;
	params: Promise<{ year: string }>;
}) {
	const currentYear = new Date(Date.now()).getFullYear();
	let year = (await params).year;
	if (year == null || year < "2018" || year > currentYear.toString() || typeof year !== "string") {
		year = currentYear.toString();
	}

	await getArchiveForYear(year);

	return <div>{children}</div>;
}
