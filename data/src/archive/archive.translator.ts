import { F1TopThree } from '../f1/f1.type';
import { Archive, ArchiveSession, TopThreeDriver } from '../types/archive.type';
import { F1Archive } from './archive.type';

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

export const translateTopThree = (topThree: F1TopThree): TopThreeDriver[] => {
	return topThree.Lines.map((driver): TopThreeDriver => {
		return {
			nr: driver.RacingNumber,
			broadcastName: driver.BroadcastName,
			fullName: driver.FullName,
			short: driver.Tla,
			teamName: driver.Team,
			teamColor: driver.TeamColour,
			position: driver.Position,
			gapToFront: driver.DiffToAhead,
			gapToLeader: driver.DiffToLeader,
			lap: driver.LapState,
		};
	});
};

export const sessionTypeTranslation = (type: string): ArchiveSession['type'] => {
	return type.toLowerCase() as ArchiveSession['type'];
};
