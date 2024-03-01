import { isBoolean } from '../assert/assert';
import { BooleanParser } from './boolean.type';

export const boolean = (): BooleanParser => {
	const options: BooleanParser = {
		type: ['boolean'],
		base: undefined,
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
		default: (value: boolean) => {
			options.base = value;
			return options;
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		parse: (argument: unknown): any => {
			if (argument === undefined && options.type.includes('undefined') && options.base !== undefined) {
				return options.base;
			}
			if (options.type.includes('transform') && typeof argument === 'number') {
				if (argument === 1) {
					return true;
				}
				if (argument === 0) {
					return false;
				}
			}
			if (options.type.includes('transform') && typeof argument === 'string') {
				if (argument === 'true') {
					return true;
				}
				if (argument === 'false') {
					return false;
				}
			}
			if (options.type.includes('undefined') && argument === undefined) {
				return argument;
			}
			if (options.type.includes('null') && argument === null) {
				return argument;
			}
			isBoolean(argument);
			return argument;
		},
	};
	return options;
};
