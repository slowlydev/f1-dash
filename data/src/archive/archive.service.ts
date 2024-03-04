import { config } from 'lib/config';
import { debug, info } from 'lib/logger';
import { F1TopThree } from '../f1/f1.type';
import { Archive, Meeting } from '../types/archive.type';
import { translateArchive, translateTopThree } from './archive.translator';
import { F1Archive } from './archive.type';

const getTopThree = async (path: string): Promise<F1TopThree> => {
	const request = await fetch(`https://${config.f1BaseUrl}/static/${path}TopThree.json`, {
		method: 'GET',
		headers: { 'content-type': 'application/json' },
	});
	const data = await request.text();
	return JSON.parse(data.trim());
};

const fetchMeeting = async (meeting: Meeting): Promise<Meeting> => {
	const sessions = await Promise.all(
		meeting.sessions.map(async (session) => {
			if (!session.path) return session;
			const topThree = translateTopThree(await getTopThree(session.path));
			return { ...session, topThree };
		}),
	);
	return { ...meeting, sessions };
};

const getArchive = async (year: number): Promise<F1Archive> => {
	debug(`gathering archive for year ${year}`);
	const request = await fetch(`https://${config.f1BaseUrl}/static/${year}/Index.json`, {
		method: 'GET',
		headers: { 'content-type': 'application/json' },
	});
	const data = await request.text();
	return JSON.parse(data.trim());
};

const fetchArchive = async (archive: Archive): Promise<Archive> => {
	debug(`gathering meetings for year ${archive.year}`);
	const meetings = await Promise.all(archive.meetings.map((meeting) => fetchMeeting(meeting)));
	return { ...archive, meetings };
};

export const findArchive = async (): Promise<Archive> => {
	info('finding archive');
	const archive = await getArchive(new Date().getFullYear());
	return fetchArchive(translateArchive(archive));
};
