import { Constraints, Type } from '../column/column.type';
import { PrimaryParser } from './primary.type';

export const primary = <T extends 'increment' | 'uuid'>(strategy: T): PrimaryParser<T> => {
	const options = {
		type: (strategy === 'increment' ? 'integer' : 'character') as Type,
		constraints: {
			length: strategy === 'uuid' ? 36 : undefined,
			primary: true,
			nullable: false,
			unique: true,
		} as Constraints,
		parse: (argument: unknown) => {
			return argument as T extends 'increment' ? number : string;
		},
	};
	return options;
};
