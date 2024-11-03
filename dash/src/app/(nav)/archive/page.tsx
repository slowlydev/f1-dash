import { env } from "@/env.mjs";

type Meeting = {
	key: number;
	location: string;
	officialName: string;
	name: string;
	country: {
		name: string;
	};
	sessions: {};
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
	//const searchParams = useSearchParams();
	//let year = searchParams.get("year");
	const currentYear = new Date(Date.now()).getFullYear().toString();
	if (year == null || year < "2017" || year > currentYear || typeof year !== "string") {
		year = currentYear;
	}
	const archive = await getArchiveForYear(year);
	return (
		<div>
			<h1>{archive?.length}</h1>
			<ul>
				{archive?.map((meet) => (
					<li className="border" key={meet.key}>
						<div className="flex flex-col">
							<div>{meet.officialName}</div>
							<div>{meet.country.name}</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
