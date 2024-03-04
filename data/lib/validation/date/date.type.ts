import { ParseFunction, Parser, RecursiveParser, Type } from '../parser.type';

export type DateParser = RecursiveParser<
	{
		type: Type[];
		transform: Parser<number>;
		optional: Parser<Date | undefined>;
		nullable: Parser<Date | null>;
		parse: ParseFunction<Date>;
	},
	Date,
	Date
>;
