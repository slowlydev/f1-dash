import { F1EventTracker } from './event-tracker.type';
import { NextMeeting, NextMeetingSession } from './meeting.type';

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
				startDate: timetable.startTime,
				endDate: timetable.endTime,
				gmtOffset: timetable.gmtOffset,
			}),
		),
	};
};
