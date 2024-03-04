import { ParseFunction } from '../../validation/parser.type';

export type Type =
	| 'int'
	| 'integer'
	| 'tinyint'
	| 'smallint'
	| 'mediumint'
	| 'bigint'
	| 'int2'
	| 'int8'
	| 'character'
	| 'varchar'
	| 'text'
	| 'blob'
	| 'real'
	| 'double'
	| 'float'
	| 'numeric'
	| 'decimal'
	| 'boolean'
	| 'date'
	| 'datetime';

export type Action = 'no action' | 'restrict' | 'set null' | 'set default' | 'cascade' | 'abort';

export type Return<T> = T extends 'character' | 'varchar' | 'text' | 'blob'
	? string
	: T extends
			| 'int'
			| 'integer'
			| 'tinyint'
			| 'smallint'
			| 'mediumint'
			| 'bigint'
			| 'int2'
			| 'int8'
			| 'real'
			| 'double'
			| 'float'
			| 'numeric'
			| 'decimal'
	? number
	: T extends 'boolean'
	? boolean
	: T extends 'date' | 'datetime'
	? Date
	: never;

export type Parser<T> = {
	type: Type;
	constraints: Constraints;
	parse: ParseFunction<T>;
};

export type Constraints = {
	name?: string;
	length?: number;
	nullable?: boolean;
	unique?: boolean;
	default?: string | number | null;
	primary?: boolean;
	references?: {
		entity: string;
		column: string;
	};
	hooks?: {
		onInsert?: string;
		onUpdate?: string;
		onDelete?: string;
	};
};

export type RecursiveParser<T, P, D, Called extends keyof T = never> = {
	[K in keyof T as Exclude<K, Called>]: K extends 'parse'
		? (argument: P extends null ? P : unknown) => P
		: K extends 'constraints'
		? Constraints
		: K extends 'type'
		? Type
		: K extends 'length'
		? (value: number) => RecursiveParser<T, D, D, Called | K>
		: K extends 'delete'
		? (action: Action) => RecursiveParser<T, D, D, Called | K>
		: K extends 'name'
		? (name: string) => RecursiveParser<T, D, D, Called | K>
		: () => RecursiveParser<T, K extends 'nullable' ? P | null : P, D, Called | K>;
};

export type ColumnParser<T> = RecursiveParser<
	{
		type: Type;
		constraints: Constraints;
		nullable: Parser<T | null>;
		unique: Parser<T>;
		length: Parser<T>;
		name: Parser<T>;
		parse: ParseFunction<T>;
	},
	T,
	T
>;

export type ColumnOptions = {
	type: Type;
	name?: string;
	length?: number;
	nullable?: boolean;
	primary?: boolean;
	default?: string | number | null;
	unique?: boolean;
	onInsert?: string;
	onUpdate?: string;
	onDelete?: string;
};
