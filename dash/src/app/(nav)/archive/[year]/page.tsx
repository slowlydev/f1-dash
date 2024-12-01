import { env } from "@/env.mjs";
import Footer from "@/components/Footer"; // Adjust the import path as necessary
import SegmentedLinks from "@/components/SegmentedLinks";
import { utc } from "moment";
import Link from "next/link";
import { Meeting } from "@/types/archive.type";
import Dropdown from "@/components/Dropdown";

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

export default async function ArchivePage({ params }: { params: Promise<{ year: string }> }) {
	const currentYear = new Date(Date.now()).getFullYear();
	let year = (await params).year;
	if (year == null || year < "2018" || year > currentYear.toString() || typeof year !== "string") {
		year = currentYear.toString();
	}
	const archive = await getArchiveForYear(year);

	const years = [];
	for (let i = 2018; i <= currentYear; i++) {
		years.push({ label: i.toString(), href: `/archive/${i.toString()}` });
	}

	const firstThreeYears = years.slice(years.length - 3);
	const previousYears = years.slice(0, years.length - 3).reverse();

	return (
		<div className="container mx-auto max-w-screen-lg px-4 pb-8">
			<div className="my-4 flex items-center justify-between">
				<h1 className="text-3xl font-bold">Archive for {year}</h1>
				<div className="flex items-center space-x-2">
					<Dropdown options={previousYears} />
					<SegmentedLinks id="year" selected={`/archive/${year}`} options={firstThreeYears} />
				</div>
			</div>
			{!archive ? (
				<div className="flex h-44 flex-col items-center justify-center">
					<p>No archive data found for {year}</p>
				</div>
			) : (
				<>
					<p className="text-zinc-600">All times are local time</p>
					<ul className="grid grid-cols-1 gap-8 md:grid-cols-2">
						{archive.map((meet) => (
							<li className="rounded-md border border-zinc-700 p-4 shadow-md" key={meet.key}>
								<div className="flex h-full flex-col justify-between">
									<div>
										<h2 className="text-xl font-bold text-white">{meet.officialName}</h2>
										<p className="text-sm text-zinc-500">{meet.country.name}</p>
										<p className="mt-1 text-sm italic text-zinc-400">{meet.location}</p>
									</div>
									<div className="mt-2">
										<p className="text-sm text-zinc-600">
											{utc(meet.sessions[0].startDate).local().format("MMMM D, YYYY")} -{" "}
											{utc(meet.sessions[meet.sessions.length - 1].endDate)
												.local()
												.format("MMMM D, YYYY")}
										</p>
									</div>
									<Link href={`/archive/${year}/${meet.key}`}>
										<div className="mt-2 text-blue-500 hover:underline">View Details</div>
									</Link>
								</div>
							</li>
						))}
					</ul>
				</>
			)}
			<Footer />
		</div>
	);
}
