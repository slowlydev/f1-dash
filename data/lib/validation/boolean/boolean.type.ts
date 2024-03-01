import { DefaultParser, ParseFunction, Parser, RecursiveParser, Type } from '../parser.type';

export type BooleanParser = RecursiveParser<
	{
		type: Type[];
		base: boolean | undefined;
		transform: Parser<boolean>;
		optional: Parser<boolean | undefined>;
		nullable: Parser<boolean | null>;
		default: DefaultParser<boolean>;
		parse: ParseFunction<boolean>;
	},
	boolean,
	boolean
>;
