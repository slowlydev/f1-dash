import { isDate } from '../assert/assert';
import { DateParser } from './date.type';

export const date = (): DateParser => {
	const options: DateParser = {
		type: ['date'],
		transform: () => {
			options.type.push('transform');
			return options;
		},
		optional: () => {
			options.type.push('undefined');
			return options;
		},
		nullable: () => {
			options.type.push('null');
			return options;
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		parse: (argument: unknown): any => {
			if (options.type.includes('transform') && typeof argument === 'string') {
				return new Date(argument);
			}
			if (options.type.includes('undefined') && argument === undefined) {
				return argument;
			}
			if (options.type.includes('null') && argument === null) {
				return argument;
			}
			isDate(argument);
			return new Date(argument);
		},
	};
	return options;
};
