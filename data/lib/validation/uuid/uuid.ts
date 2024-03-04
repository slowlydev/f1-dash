import { isUuid } from '../assert/assert';
import { UuidParser } from './uuid.type';

export const uuid = (): UuidParser => {
	const options: UuidParser = {
		type: ['uuid'],
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
			if (options.type.includes('undefined') && argument === undefined) {
				return argument;
			}
			if (options.type.includes('null') && argument === null) {
				return argument;
			}
			isUuid(argument);
			return argument;
		},
	};
	return options;
};
