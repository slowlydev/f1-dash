import { isUnion } from '../assert/assert';
import { UnionParser } from './union.type';

export const union = <T extends string | number | boolean>(values: T[]): UnionParser<T> => {
	const options: UnionParser<T> = {
		type: ['union'],
		base: undefined,
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		optional: () => {
			options.type.push('undefined');
			return options;
		},
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		nullable: () => {
			options.type.push('null');
			return options;
		},
		default: (value: T) => {
			options.base = value;
			return options;
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		parse: (argument: unknown): any => {
			if (argument === undefined && options.type.includes('undefined') && options.base !== undefined) {
				return options.base;
			}
			if (options.type.includes('undefined') && argument === undefined) {
				return argument;
			}
			if (options.type.includes('null') && argument === null) {
				return argument;
			}
			isUnion(argument, values);
			return argument;
		},
	};
	return options;
};
