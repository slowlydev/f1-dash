import { utc } from "moment";

import { Session } from "@/types/schedule.type";

type SessionDayGroup = { date: string; sessions: Session[] };

export const groupSessionByDay = (sessions: Session[]): SessionDayGroup[] => {
	return sessions.reduce((groups: SessionDayGroup[], next) => {
		const nextDate = utc(next.start).format("ddddd");
		const groupIndex = groups.findIndex((group) => utc(group.date).format("ddddd") === nextDate);

		if (groupIndex < 0) {
			// not found
			groups = [...groups, { date: next.start, sessions: [next] }];
		} else {
			// found
			groups[groupIndex] = { ...groups[groupIndex], sessions: [...groups[groupIndex].sessions, next] };
		}

		return groups;
	}, []);
};
