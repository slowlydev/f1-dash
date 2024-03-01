import { DefaultParser, ParseFunction, Parser, RecursiveParser, Type } from '../parser.type';

export type UnionParser<T> = RecursiveParser<
	{
		type: Type[];
		base: T | undefined;
		optional: Parser<T | undefined>;
		nullable: Parser<T | null>;
		default: DefaultParser<T>;
		parse: ParseFunction<T>;
	},
	T,
	T
>;
