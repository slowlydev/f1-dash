import { ColumnOptions } from '../../database/column/column.type';
import { Entity } from '../../database/entity/entity.type';
import { error } from '../../logger/logger';
import { boolean } from '../../validation/boolean/boolean';
import { date } from '../../validation/date/date';
import { IdEntity } from '../repository.type';

export const transformEntity = <T extends IdEntity>(table: Entity<T>, entity: T): T => {
	try {
		const transformed = entity;
		Object.keys(entity).map((key) => {
			if (key !== 'id' && !('references' in table.columns[key])) {
				const column = table.columns[key as Exclude<keyof T, 'id'>] as ColumnOptions;
				if (column.type === 'boolean' && entity[key] !== null) {
					transformed[key as keyof T] = boolean().transform().parse(entity[key]) as T[keyof T];
				}
				if (column.type === 'datetime' && entity[key] !== null) {
					transformed[key as keyof T] = date().transform().parse(entity[key]) as T[keyof T];
				}
			}
		});
		return transformed;
	} catch (err) {
		error(`transformation failed for entity '${table.name}'`, err);
		throw err;
	}
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const transformData = (data: object): any[] => {
	return Object.values(data)
		.map((value) => (value instanceof Date ? value.toISOString() : value))
		.filter((value) => value !== undefined);
};
