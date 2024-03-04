import { ColumnOptions, Constraints, Parser, Type } from '../column/column.type';
import { RelationOptions } from '../relation/relation.type';
import { Entity } from './entity.type';

const buildConstraints = (name: string, type: Type, constraints: Constraints): string => {
	const builder: string[] = [];
	builder.push(constraints.name ?? name);
	builder.push(`${type}${constraints.length ? `(${constraints.length})` : ''}`);
	builder.push(constraints.nullable ? 'null' : 'not null');
	constraints.unique && builder.push('unique');
	constraints.default !== undefined && builder.push(`default ${constraints.default}`);
	constraints.primary && builder.push('primary key');
	if (constraints.references) {
		builder.push(`references ${constraints.references.entity}(${constraints.references.column})`);
		constraints.hooks?.onDelete && builder.push(`on delete ${constraints.hooks.onDelete}`);
	}
	return builder.join(' ');
};

export const generateSchema = <T, S extends Record<string, Parser<T>>>(name: string, columnOptions: S): string => {
	const schemaColumns: string[] = [];
	Object.keys(columnOptions).forEach((key) => {
		const column = columnOptions[key];
		if ('references' in column.constraints) {
			schemaColumns.push(buildConstraints(key, column.type, column.constraints));
		} else {
			if (column.constraints.primary) {
				schemaColumns.push(buildConstraints('id', column.type, column.constraints));
			} else {
				schemaColumns.push(buildConstraints(key, column.type, column.constraints));
			}
		}
	});
	return `create table if not exists ${name} (${schemaColumns.join(',')})`;
};

export const generateColumns = <T, S extends Record<string, Parser<T>>>(
	columnOptions: S,
): { id: ColumnOptions } & Record<string, ColumnOptions | RelationOptions> => {
	const generatedColumns: { id: ColumnOptions } & Record<string, ColumnOptions | RelationOptions> = {
		id: columnOptions.id,
	};
	Object.keys(columnOptions).forEach((key) => {
		if ('references' in columnOptions[key].constraints) {
			const columns: RelationOptions = {
				name: columnOptions[key].constraints.name,
				nullable: false,
				references: {
					entity: columnOptions[key].constraints.references?.entity ?? '',
					column: columnOptions[key].constraints.references?.column ?? '',
				},
			};
			generatedColumns[key] = columns;
		} else {
			const options: ColumnOptions = {
				type: columnOptions[key].type,
				name: columnOptions[key].constraints.name,
				length: columnOptions[key].constraints.length,
				nullable: columnOptions[key].constraints.nullable,
				primary: columnOptions[key].constraints.primary,
				default: columnOptions[key].constraints.default,
				unique: columnOptions[key].constraints.unique,
				onInsert: columnOptions[key].constraints.hooks?.onInsert,
				onUpdate: columnOptions[key].constraints.hooks?.onUpdate,
				onDelete: columnOptions[key].constraints.hooks?.onDelete,
			};
			generatedColumns[key] = options;
		}
	});
	return generatedColumns;
};

export const entity = <T, S extends Record<string, Parser<T>>>(
	name: string,
	columnOptions: S,
): Entity<{ [K in keyof S]: ReturnType<S[K]['parse']> }> => {
	const generatedSchema = generateSchema<T, S>(name, columnOptions);
	const generatedColumns = generateColumns<T, S>(columnOptions);

	return {
		name,
		schema: generatedSchema,
		columns: generatedColumns,
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		parser: { ...columnOptions, parse: (argument): argument is null => null },
	};
};
