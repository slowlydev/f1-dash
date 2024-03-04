import { Constraints, Type } from '../column/column.type';
import { UpdatedParser } from './updated.type';

export const updated = (): UpdatedParser => {
	const options = {
		type: 'datetime' as Type,
		constraints: {
			name: undefined,
			nullable: true,
			default: null,
			hooks: {
				onUpdate: `(datetime('now'))`,
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
