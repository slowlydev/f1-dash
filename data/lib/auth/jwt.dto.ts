import { number } from '../validation/number/number';
import { object } from '../validation/object/object';
import { Infer } from '../validation/parser.type';
import { string } from '../validation/string/string';
import { uuid } from '../validation/uuid/uuid';

export const jwtDto = object({
	id: uuid(),
	iat: number(),
	exp: number(),
});

export type JwtDto = Infer<typeof jwtDto>;

export const headDto = object({
	alg: string(),
	typ: string(),
});

export type HeadDto = Infer<typeof headDto>;
