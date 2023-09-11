import { Constraints, DefaultParser, ParseFunction, Parser, RecursiveParser, Type } from "../parser.type";

export type StringParser = RecursiveParser<
	{
		type: Type[];
		base: string | undefined;
		constraints: Constraints;
		optional: Parser<string | undefined>;
		nullable: Parser<string | null>;
		min: Parser<string>;
		max: Parser<string>;
		default: DefaultParser<string>;
		parse: ParseFunction<string>;
	},
	string,
	string
>;
