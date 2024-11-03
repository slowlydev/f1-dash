import { env } from "@/env.mjs";
import { utc } from "moment";
import Footer from "@/components/Footer"; // Adjust the import path as necessary

type Meeting = {
	key: number;
	location: string;
	officialName: string;
	name: string;
	country: {
		name: string;
	};
	sessions: {
		startDate: string;
		endDate: string;
	}[];
};

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

export default async function ArchivePage({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	let year = searchParams["year"];
	const currentYear = new Date(Date.now()).getFullYear().toString();
	if (year == null || year < "2017" || year > currentYear || typeof year !== "string") {
		year = currentYear;
	}
	const archive = await getArchiveForYear(year);

	if (!archive) {
		return (
			<div className="flex h-44 flex-col items-center justify-center">
				<p>No archive data found for {year}</p>
			</div>
		);
	}

	return (
		<div className="container mx-auto max-w-screen-lg px-4 pb-8">
			<div className="my-4">
				<h1 className="text-3xl font-bold">Archive for {year}</h1>
				<p className="text-zinc-600">All times are local time</p>
			</div>
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
						</div>
					</li>
				))}
			</ul>
			<Footer />
		</div>
	);
}
