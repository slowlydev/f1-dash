import { error } from '../logger/logger';
import { Tab } from './cron.type';

export const tabs: Tab[] = [];

export const cron = (schedule: Tab['schedule'], handler: Tab['handler']): void => {
	if (!schedule.match(/^(\d|\d-\d|\d(,\d)+|\*)( (\d+|\d+-\d+|\d+(,\d+)+|\*)){5}$/)) {
		return error('invalid cron schedule', schedule);
	}
	tabs.push({ schedule, handler });
};

export const match = (field: string, frag: number): boolean => {
	if (field === '*') return true;
	if (field.match(/^\d+$/) && +field === frag) return true;
	if (field.match(/^\d+-\d+$/)) {
		const [min, max] = field.split('-').reduce<number[]>((scope, value) => [...scope, +value], []);
		if (min <= frag && max >= frag) return true;
	}
	if (field.match(/^\d+(,\d+)+$/)) {
		const values = field.split(',').map((value) => +value);
		if (values.includes(frag)) return true;
	}
	return false;
};

export const crontab = (time: number): void => {
	const date = new Date(time);
	const fire = tabs.filter((tab) => {
		const [weekday, month, day, hour, minute, second] = tab.schedule.split(' ');
		return (
			match(weekday, date.getDay() + 1) &&
			match(month, date.getMonth() + 1) &&
			match(day, date.getDate()) &&
			match(hour, date.getHours()) &&
			match(minute, date.getMinutes()) &&
			match(second, date.getSeconds())
		);
	});
	fire.forEach((tab) => tab.handler());
};
