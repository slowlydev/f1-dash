import { Constraints, Type } from '../column/column.type';
import { DeletedParser } from './deleted.type';

export const deleted = (): DeletedParser => {
	const options = {
		type: 'datetime' as Type,
		constraints: {
			name: undefined,
			nullable: true,
			default: null,
			hooks: {
				onDelete: `(datetime('now'))`,
			},
		} as Constraints,
		name: (name: string) => {
			options.constraints.name = name;
			return options;
		},
		parse: (argument: unknown) => {
			return argument as Date;
		},
	};
	return options;
};
