import { Action, Constraints, Type } from '../column/column.type';
import { Entity } from '../entity/entity.type';
import { RelationParser } from './relation.type';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const relation = <T extends string | number = string>(entity: Entity<any>): RelationParser<T> => {
	const options = {
		type: (entity.columns.id.type === 'integer' ? 'integer' : 'character') as Type,
		constraints: {
			name: undefined,
			length: entity.columns.id.length,
			nullable: false,
			references: { entity: entity.name, column: 'id' },
		} as Constraints,
		nullable: () => {
			options.constraints.nullable = true;
			return options;
		},
		delete: (action: Action) => {
			options.constraints.hooks = {};
			options.constraints.hooks.onDelete = action;
			return options;
		},
		name: (name: string) => {
			options.constraints.name = name;
			return options;
		},
		parse: (argument: unknown) => {
			return argument as T;
		},
	};
	return options;
};
