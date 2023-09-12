import { F1Archive } from "./archive.f1.type";
import { Archive } from "./archive.type";

export const getArchive = async (year: number): Promise<F1Archive> => {
	const req = await fetch(`https://livetiming.formula1.com/static/${year}/Index.json`, {
		method: "GET",
		headers: {
			"User-Agent": "F1-Data-Server",
			"Content-Type": "application/json",
		}
	});
	
	const text = await req.text();
	const json: F1Archive = JSON.parse(text.trim()); // TODO trim() is a bun workaround, remove when fixed

	return json;
}

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
				type: session.Type,
				number: session.Number,
				name: session.Name,
				startDate: session.StartDate,
				endDate: session.EndDate,
				gmtOffset: session.GmtOffset,
				path: session.Path,
			})),
		})),
	}
}