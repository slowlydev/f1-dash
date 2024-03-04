import { SQLQueryBindings } from 'bun:sqlite';
import { randomUUID } from 'crypto';
import { config } from '../config/config';
import { ColumnOptions } from '../database/column/column.type';
import { insertMany, insertOne, runQuery, selectMany, selectOne } from '../database/database';
import { Entity } from '../database/entity/entity.type';
import { debug } from '../logger/logger';
import { orderBy, paginate, whereMany, whereOne } from './helpers/helpers';
import { migrate } from './migrate/migrate';
import { determineOperator } from './operators/operators';
import { FindOneOptions, FindOptions, IdEntity, InsertData, UpdateData, WhereOptions } from './repository.type';
import { transformData, transformEntity } from './transform/transform';

type Repository<T extends IdEntity> = {
	init: () => Promise<void>;
	find: <S extends keyof T>(options?: FindOptions<T, S>) => Promise<Pick<T, S>[]>;
	findOne: <S extends keyof T>(options: T['id'] | FindOneOptions<T, S>) => Promise<Pick<T, S> | null>;
	insert: (data: InsertData<T>) => Promise<{ id: T['id'] }>;
	insertMany: (data: InsertData<T>[]) => Promise<{ id: T['id'] }[]>;
	update: (criteria: T['id'] | WhereOptions<T>, data: UpdateData<T>) => Promise<void>;
	delete: (criteria: T['id'] | WhereOptions<T>) => Promise<void>;
	softDelete: (criteria: T['id'] | WhereOptions<T>) => Promise<void>;
	restore: (criteria: T['id'] | WhereOptions<T>) => Promise<void>;
	wipe: () => Promise<void>;
	drop: () => Promise<void>;
};

export const repository = <T extends IdEntity>(table: Entity<T>): Repository<T> => {
	if (config.databasePath === ':memory:' || config.stage === 'test') {
		debug(`creating schema for table '${table.name}'`);
		runQuery(table.schema);
	}

	if (config.stage === 'dev') {
		const schema = selectOne(`select sql from sqlite_master where type = 'table' and name = '${table.name}'`);
		if (schema && 'sql' in schema && typeof schema.sql === 'string') {
			const before = schema.sql.replace(`${'create table'.toUpperCase()} ${table.name} `, '');
			const after = table.schema.replace(`create table if not exists ${table.name} `, '');
			if (before !== after) {
				migrate(table.name, before, after);
			}
		}
	}

	const selectKeys = <S extends keyof T>(select?: FindOptions<T, S>['select']): string => {
		const keys = Object.keys(table.columns).map((key) =>
			table.columns[key].name ? `${table.columns[key].name} as ${key}` : key,
		);
		if (select && Object.keys(select).length) {
			const filteredKeys = Object.keys(select)
				.filter((key) => select[key as keyof FindOptions<T, S>['select']] === true)
				.map((key) => (table.columns[key].name ? `${table.columns[key].name} as ${key}` : key));
			if (filteredKeys.length) {
				return `select ${filteredKeys.join(',')} from`;
			}
		}
		return `select ${keys.join(',')} from`;
	};

	const whereKeys = (where?: FindOptions<T, keyof T>['where'], deleted = false): string | undefined => {
		const columns = Object.keys(table.columns).filter((key) => !('references' in table.columns[key]));
		const deletedColumn = columns.find(
			(column) => (table.columns as Record<string, ColumnOptions>)[column].onDelete === `(datetime('now'))`,
		);
		let deletedKey: string | undefined;
		if (deletedColumn && !deleted) {
			deletedKey = (table.columns[deletedColumn] as ColumnOptions).name ?? deletedColumn;
		}

		if (where) {
			if (Array.isArray(where)) {
				const constraints = where.map((whe) => {
					const filtered = Object.keys(whe).filter((key) => whe[key] !== undefined);
					const keys = filtered.map((key) => `${table.columns[key].name ?? key} ${determineOperator<T>(whe, key)} ?`);
					if (deletedKey && !deleted) keys.push(`${deletedKey} is null`);
					return `${keys.join(' and ')}`;
				});
				return where.length ? `where ${constraints.join(' or ')}` : '';
			}
			if (Object.keys(where).length) {
				const filtered = Object.keys(where).filter((key) => where[key] !== undefined);
				if (filtered.length) {
					const keys = filtered.map((key) => `${table.columns[key].name ?? key} ${determineOperator<T>(where, key)} ?`);
					if (deletedKey && !deleted) keys.push(`${deletedKey} is null`);
					return `where ${keys.join(' and ')}`;
				}
			}
		}

		return deletedKey ? `where ${deletedKey} is null` : undefined;
	};

	return {
		init(): Promise<void> {
			return new Promise((resolve) => {
				runQuery(table.schema);
				return resolve(void 0);
			});
		},

		find<S extends keyof T>(options?: FindOptions<T, S>): Promise<Pick<T, S>[]> {
			return new Promise((resolve) => {
				const [where, select, order, skip, take, deleted] = [
					options?.where,
					options?.select,
					options?.order,
					options?.skip,
					options?.take,
					options?.deleted,
				];
				const constraints = [
					selectKeys(select),
					table.name,
					whereKeys(where, deleted),
					orderBy<T, S>(order),
					paginate<T, S>(take, skip),
				].filter((constraint) => !!constraint);
				const entities = selectMany<T>(`${constraints.join(' ')}`, whereMany<T, S>(where));
				const transformed = entities.map((entity) => transformEntity(table, entity));
				return resolve(transformed);
			});
		},

		findOne<S extends keyof T>(options: T['id'] | FindOneOptions<T, S>): Promise<Pick<T, S> | null> {
			return new Promise((resolve) => {
				let where: FindOneOptions<T, S>['where'] = {};
				let select: FindOptions<T, S>['select'] = undefined;
				let deleted: FindOptions<T, S>['deleted'] = false;
				typeof options !== 'object'
					? (where.id = options)
					: ([where, select, deleted] = [options.where, options?.select, options?.deleted]);

				if (!Object.keys(where).length) {
					throw Error(`find one needs at least one where key`);
				}

				const constraints = [selectKeys(select), table.name, whereKeys(where, deleted)].filter(
					(constraint) => !!constraint,
				);
				const entity = selectOne<T>(`${constraints.join(' ')}`, whereOne<T, S>(where));
				const transformed = entity === null ? null : transformEntity<T>(table, entity);
				return resolve(transformed);
			});
		},

		insert(data: InsertData<T>): Promise<{ id: T['id'] }> {
			return new Promise((resolve) => {
				const uuid = data.id ?? table.columns.id.type === 'integer' ? undefined : randomUUID();
				const keys = Object.keys(data)
					.filter((key) => data[key as keyof InsertData<T>] !== undefined)
					.map((key) => table.columns[key].name ?? key);
				const placeholders = Object.keys(data)
					.filter((key) => data[key as keyof InsertData<T>] !== undefined)
					.map(() => '?');
				const values = transformData(data);

				const columnKeys = Object.keys(table.columns).filter((key) => !('references' in table.columns[key]));
				const columns = table.columns as Record<string, ColumnOptions>;

				const createdColumn = columnKeys.find((column) => columns[column].onInsert === `(datetime('now'))`);
				const updatedColumn = columnKeys.find((column) => columns[column].onUpdate === `(datetime('now'))`);
				const deletedColumn = columnKeys.find((column) => columns[column].onDelete === `(datetime('now'))`);

				if (createdColumn) {
					keys.push(columns[createdColumn].name ?? createdColumn);
					placeholders.push(`${columns[createdColumn].default}`);
				}
				if (updatedColumn) {
					keys.push(columns[updatedColumn].name ?? updatedColumn);
					placeholders.push(`${columns[updatedColumn].default}`);
				}
				if (deletedColumn) {
					keys.push(columns[deletedColumn].name ?? deletedColumn);
					placeholders.push(`${columns[deletedColumn].default}`);
				}

				if (uuid) {
					keys.unshift('id');
					values.unshift(uuid);
					placeholders.unshift('?');
				}

				const result = insertOne(
					`insert into ${table.name} (${keys.join(',')}) values (${placeholders.join(',')})`,
					values,
				);
				return resolve(result);
			});
		},

		insertMany(data: InsertData<T>[]): Promise<{ id: T['id'] }[]> {
			return new Promise((resolve) => {
				const uuids = data.map((dat) => (dat.id ?? table.columns.id.type === 'integer' ? undefined : randomUUID()));
				const keys = Object.keys(data[0])
					.filter((key) => data[0][key as keyof InsertData<T>] !== undefined)
					.map((key) => table.columns[key].name ?? key);

				const placeholders: string[][] = [];
				const values: unknown[][] = [];

				const columnKeys = Object.keys(table.columns).filter((key) => !('references' in table.columns[key]));
				const columns = table.columns as Record<string, ColumnOptions>;

				const createdColumn = columnKeys.find((column) => columns[column].onInsert === `(datetime('now'))`);
				const updatedColumn = columnKeys.find((column) => columns[column].onUpdate === `(datetime('now'))`);
				const deletedColumn = columnKeys.find((column) => columns[column].onDelete === `(datetime('now'))`);

				uuids.forEach((uuid, ind) => {
					values.push(transformData(data[ind]));
					placeholders.push(
						Object.keys(data[ind])
							.filter((key) => data[ind][key as keyof InsertData<T>] !== undefined)
							.map(() => '?'),
					);

					if (createdColumn) {
						ind === 0 && keys.push(columns[createdColumn].name ?? createdColumn);
						placeholders[ind].push(`${columns[createdColumn].default}`);
					}
					if (updatedColumn) {
						ind === 0 && keys.push(columns[updatedColumn].name ?? updatedColumn);
						placeholders[ind].push(`${columns[updatedColumn].default}`);
					}
					if (deletedColumn) {
						ind === 0 && keys.push(columns[deletedColumn].name ?? deletedColumn);
						placeholders[ind].push(`${columns[deletedColumn].default}`);
					}

					if (uuid) {
						ind === 0 && keys.unshift('id');
						values[ind].unshift(uuid);
						placeholders[ind].unshift('?');
					}
				});

				const result = insertMany(
					`insert into ${table.name} (${keys.join(',')}) values ${placeholders
						.map((places) => `(${places.join(',')})`)
						.join(',')}`,
					values.flat() as SQLQueryBindings[],
				);
				return resolve(result);
			});
		},

		update(criteria: T['id'] | WhereOptions<T>, data: UpdateData<T>): Promise<void> {
			return new Promise((resolve) => {
				const keys = Object.keys(data)
					.filter((key) => data[key as keyof UpdateData<T>] !== undefined)
					.map((key) => table.columns[key].name ?? key)
					.map((key) => `${key} = ?`);

				const values = transformData(data);
				const columns = Object.keys(table.columns).filter((key) => !('references' in table.columns[key]));
				const updatedColumn = columns.find(
					(column) => (table.columns as Record<string, ColumnOptions>)[column].onUpdate === `(datetime('now'))`,
				);

				if (updatedColumn && (table.columns[updatedColumn] as ColumnOptions).onUpdate === `(datetime('now'))`) {
					keys.push(`${(table.columns[updatedColumn] as ColumnOptions).name ?? updatedColumn} = (datetime('now'))`);
				}

				let where: WhereOptions<T> = {};
				typeof criteria !== 'object' ? (where.id = criteria) : (where = criteria);

				runQuery(`update ${table.name} set ${keys} ${whereKeys(where)}`, [
					...values,
					...(whereOne<T, keyof T>(where) ?? []),
				]);
				return resolve(void 0);
			});
		},

		delete(criteria: T['id'] | WhereOptions<T>): Promise<void> {
			return new Promise((resolve) => {
				let where: WhereOptions<T> = {};
				typeof criteria !== 'object' ? (where.id = criteria) : (where = criteria);

				runQuery(`delete from ${table.name} ${whereKeys(where)}`, whereOne<T, keyof T>(where));
				return resolve(void 0);
			});
		},

		softDelete(criteria: T['id'] | WhereOptions<T>): Promise<void> {
			return new Promise((resolve) => {
				const columns = Object.keys(table.columns).filter((key) => !('references' in table.columns[key]));
				const deletedColumn = columns.find(
					(column) => (table.columns as Record<string, ColumnOptions>)[column].onDelete === `(datetime('now'))`,
				);

				if (deletedColumn) {
					let where: WhereOptions<T> = {};
					typeof criteria !== 'object' ? (where.id = criteria) : (where = criteria);

					const key = (table.columns[deletedColumn] as ColumnOptions).name ?? deletedColumn;
					runQuery(
						`update ${table.name} set ${key} = (datetime('now')) ${whereKeys(where)}`,
						whereOne<T, keyof T>(where),
					);
					return resolve(void 0);
				} else {
					throw Error(`entity '${table.name}' has no deleted column`);
				}
			});
		},

		restore(criteria: T['id'] | WhereOptions<T>): Promise<void> {
			return new Promise((resolve) => {
				const columns = Object.keys(table.columns).filter((key) => !('references' in table.columns[key]));
				const deletedColumn = columns.find(
					(column) => (table.columns as Record<string, ColumnOptions>)[column].onDelete === `(datetime('now'))`,
				);

				if (deletedColumn) {
					let where: WhereOptions<T> = {};
					typeof criteria !== 'object' ? (where.id = criteria) : (where = criteria);

					const key = (table.columns[deletedColumn] as ColumnOptions).name ?? deletedColumn;
					runQuery(`update ${table.name} set ${key} = null ${whereKeys(where, true)}`, whereOne<T, keyof T>(where));
					return resolve(void 0);
				} else {
					throw Error(`entity '${table.name}' has no deleted column`);
				}
			});
		},

		wipe(): Promise<void> {
			return new Promise((resolve) => {
				runQuery(`delete from ${table.name}`);
				return resolve(void 0);
			});
		},

		drop(): Promise<void> {
			return new Promise((resolve) => {
				runQuery(`drop table ${table.name}`);
				return resolve(void 0);
			});
		},
	};
};
