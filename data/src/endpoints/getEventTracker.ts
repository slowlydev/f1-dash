import { F1EventTracker } from "../f1-types/eventTracker.f1.type";
import { NextMeeting, NextMeetingSession } from "../types/nextMeeting.type";

export const getAPIKey = (): string => {
	return "qPgPPRJyGCIPxFT3el4MF7thXHyJCzAP";
};

export const getEventTracker = async (apiKey: string) => {
	const req = await fetch("https://api.formula1.com/v1/event-tracker", {
		credentials: "omit",
		headers: {
			Accept: "application/json, text/javascript, */*; q=0.01",
			"Accept-Language": "en-GB,en;q=0.9",
			apiKey,
			locale: "en",
		},
		method: "GET",
		mode: "cors",
		redirect: "follow",
	});

	const text = await req.text();
	const json: F1EventTracker = JSON.parse(text.trim());
	return json;
};

export const translateNextMeeting = (eventTracker: F1EventTracker): NextMeeting => {
	return {
		key: 0,
		name: eventTracker.race.meetingCountryName,
		officialName: eventTracker.race.meetingOfficialName,
		location: eventTracker.race.meetingCountryName,
		sessions: eventTracker.seasonContext.timetables.map(
			(timetable): NextMeetingSession => ({
				name: timetable.description,
				short: timetable.session,
				state: timetable.state,
				startTime: timetable.startTime,
				endTime: timetable.endTime,
				gmtOffset: timetable.gmtOffset,
			}),
		),
	};
};
