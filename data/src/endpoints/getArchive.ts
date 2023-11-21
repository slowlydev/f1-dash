import { F1Archive, F1Meeting } from "../f1-types/archive.f1.type";
import { Archive, ArchiveSession, Meeting } from "../types/archive.type";
import { getTopThree, translateTopThree } from "./getTopThree";

export const getArchive = async (year: number): Promise<F1Archive> => {
	const req = await fetch(`https://livetiming.formula1.com/static/${year}/Index.json`, {
		method: "GET",
		headers: {
			"User-Agent": "F1-Data-Server",
			"Content-Type": "application/json",
		},
	});

	const text = await req.text();
	const json: F1Archive = JSON.parse(text.trim()); // TODO trim() is a bun workaround, remove when fixed

	return json;
};

const fetchMeeting = async (meeting: Meeting): Promise<Meeting> => {
	const promises = meeting.sessions.map(async (session) => {
		if (!session.path) return session;

		const topThree = translateTopThree(await getTopThree(session.path));

		return {
			...session,
			topThree,
		};
	});

	const sessions = await Promise.all(promises);

	return {
		...meeting,
		sessions,
	};
};

export const fetchArchive = async (archive: Archive): Promise<Archive> => {
	const promises = archive.meetings.map((meeting) => fetchMeeting(meeting));
	const meetings = await Promise.all(promises);

	console.log("meetings");

	return {
		...archive,
		meetings,
	};
};

export const translateArchive = (archive: F1Archive): Archive => {
	return {
		year: archive.Year,
		meetings: archive.Meetings.map((meeting) => ({
			key: meeting.Key,
			code: meeting.Code,
			name: meeting.Name,
			number: meeting.Number,
			location: meeting.Location,
			officialName: meeting.OfficialName,
			country: {
				key: meeting.Country.Key,
				code: meeting.Country.Code,
				name: meeting.Country.Name,
			},
			circuit: {
				key: meeting.Circuit.Key,
				shortName: meeting.Circuit.ShortName,
			},
			sessions: meeting.Sessions.map((session) => ({
				key: session.Key,
				type: sessionTypeTranslation(session.Type),
				number: session.Number,
				name: session.Name,
				startDate: session.StartDate,
				endDate: session.EndDate,
				gmtOffset: session.GmtOffset,
				path: session.Path,
				topThree: [],
			})),
		})),
	};
};

const sessionTypeTranslation = (type: string): ArchiveSession["type"] => {
	return type.toLowerCase() as ArchiveSession["type"];
};
