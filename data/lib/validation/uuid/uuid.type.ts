import { ParseFunction, Parser, RecursiveParser, Type } from '../parser.type';

export type UuidParser = RecursiveParser<
	{
		type: Type[];
		optional: Parser<string | undefined>;
		nullable: Parser<string | null>;
		parse: ParseFunction<string>;
	},
	string,
	string
>;
