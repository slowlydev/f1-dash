import { Constraints, Return, Type } from '../column/column.type';
import { ColumnParser } from './column.type';

export const column = <T extends Type>(type: T): ColumnParser<Return<T>> => {
	const options = {
		type: type,
		constraints: { name: undefined, length: undefined, nullable: false, unique: false } as Constraints,
		name: (name: string) => {
			options.constraints.name = name;
			return options;
		},
		length: (length: number) => {
			options.constraints.length = length;
			return options;
		},
		nullable: () => {
			options.constraints.nullable = true;
			return options;
		},
		unique: () => {
			options.constraints.unique = true;
			return options;
		},
		parse: (argument: unknown) => {
			return argument as Return<T>;
		},
	};
	return options;
};
