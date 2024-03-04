import { ParseFunction } from '../../validation/parser.type';
import { ColumnOptions, Constraints, Parser, RecursiveParser, Type } from '../column/column.type';
import { RelationOptions } from '../relation/relation.type';

export type Entity<T> = {
	name: string;
	schema: string;
	columns: { id: ColumnOptions } & Record<string, ColumnOptions | RelationOptions>;
	parser: EntityParser<T>;
};

export type EntityParser<T> = RecursiveParser<
	{
		type: Type;
		constraints: Constraints;
		nullable: Parser<T | null>;
		parse: ParseFunction<T>;
	},
	T,
	T
>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Infer<T extends Entity<any>> = ReturnType<T['parser']['parse']>;
