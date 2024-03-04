import { Constraints, DefaultParser, ParseFunction, Parser, RecursiveParser, Type } from "../parser.type";

export type NumberParser = RecursiveParser<
	{
		type: Type[];
		base: number | undefined;
		transform: Parser<number>;
		constraints: Constraints;
		optional: Parser<number | undefined>;
		nullable: Parser<number | null>;
		min: Parser<string>;
		max: Parser<string>;
		default: DefaultParser<number>;
		parse: ParseFunction<number>;
	},
	number,
	number
>;
