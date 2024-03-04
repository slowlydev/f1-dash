import { ParseFunction } from '../../validation/parser.type';
import { Constraints, RecursiveParser } from '../column/column.type';

export type PrimaryParser<T extends 'increment' | 'uuid'> = RecursiveParser<
	{
		type: 'varchar' | 'integer';
		constraints: Constraints;
		parse: ParseFunction<T extends 'increment' ? number : string>;
	},
	T extends 'increment' ? number : string,
	T extends 'increment' ? number : string
>;
