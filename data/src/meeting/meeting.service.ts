import { F1EventTracker } from './event-tracker.type';
import { translateNextMeeting } from './meeting.translator';
import { NextMeeting } from './meeting.type';

export const getAPIKey = (): string => {
	return 'qPgPPRJyGCIPxFT3el4MF7thXHyJCzAP';
};

export const getEventTracker = async (apiKey: string): Promise<F1EventTracker> => {
	const request = await fetch('https://api.formula1.com/v1/event-tracker', {
		credentials: 'omit',
		headers: {
			accept: 'application/json, text/javascript, */*; q=0.01',
			'accept-language': 'en-GB,en;q=0.9',
			apiKey,
			locale: 'en',
		},
		method: 'GET',
		mode: 'cors',
		redirect: 'follow',
	});
	const data = await request.text();
	return JSON.parse(data.trim());
};

export const findNextMeeting = async (): Promise<NextMeeting> => {
	const apiKey = getAPIKey();
	const eventTracker = await getEventTracker(apiKey);
	return translateNextMeeting(eventTracker);
};
