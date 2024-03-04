import { ParseFunction } from '../../validation/parser.type';
import { Constraints, Parser, RecursiveParser } from '../column/column.type';

export type CreatedParser = RecursiveParser<
	{
		type: 'datetime';
		constraints: Constraints;
		name: Parser<Date>;
		parse: ParseFunction<Date>;
	},
	Date,
	Date
>;
