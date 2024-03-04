import { ParseFunction } from '../../validation/parser.type';
import { Constraints, Parser, RecursiveParser, Type } from '../column/column.type';

export type RelationParser<T extends string | number> = RecursiveParser<
	{
		type: Type;
		constraints: Constraints;
		nullable: Parser<T | null>;
		delete: Parser<T>;
		name: Parser<T>;
		parse: ParseFunction<T>;
	},
	T,
	T
>;

export type RelationOptions = {
	name?: string;
	nullable?: boolean;
	references: {
		entity: string;
		column: string;
	};
};
