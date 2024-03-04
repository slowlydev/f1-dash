import { ParseFunction } from '../../validation/parser.type';
import { Constraints, Parser, RecursiveParser } from '../column/column.type';

export type DeletedParser = RecursiveParser<
	{
		type: 'datetime';
		constraints: Constraints;
		name: Parser<Date | null>;
		parse: ParseFunction<Date | null>;
	},
	Date | null,
	Date | null
>;
