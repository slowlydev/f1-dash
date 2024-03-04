import { IdEntity } from '../repository/repository.type';
import { Timing } from '../timing/timing.type';
import { Parser } from '../validation/parser.type';

export type Path = string | { path: string; version?: number; prefix?: string };

export type Method = 'all' | 'get' | 'post' | 'put' | 'patch' | 'delete' | 'options';

export type Param = Record<string, unknown>;

export type Query = Record<string, unknown>;

export type FluxifyRequest = Request & {
	id: string;
	ip: string;
	time: number;
	times: { name: Timing; start: number; stop?: number }[];
};

type Responses = object | unknown[] | IdEntity | IdEntity[] | Response | null;
export type FluxifyResponse = Responses | Promise<Responses>;

export type Route = {
	method: Method;
	endpoint: string;
	schema: Schema<unknown, unknown, unknown, unknown> | null;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	handler: ({ param, query, body, jwt, req }: HandlerSchema<any, any, any, any>) => FluxifyResponse;
};

export type Schema<P, Q, B, J> = {
	param?: Parser<P>;
	query?: Parser<Q>;
	body?: Parser<B>;
	jwt?: Parser<J>;
	cache?: { ttl?: number };
	throttle?: { ttl?: number; limit?: number };
};

export type HandlerSchema<P, Q, B, J> = {
	param: TypedParam<P>;
	query: TypedQuery<Q>;
	body: TypedBody<B>;
	jwt: TypedJwt<J>;
	req: FluxifyRequest;
};

type TypedParam<P> = P extends undefined
	? undefined
	: ReturnType<NonNullable<Schema<P, unknown, unknown, unknown>['param']>['parse']>;

type TypedQuery<Q> = Q extends undefined
	? undefined
	: ReturnType<NonNullable<Schema<unknown, Q, unknown, unknown>['query']>['parse']>;

type TypedBody<B> = B extends undefined
	? undefined
	: ReturnType<NonNullable<Schema<unknown, unknown, B, unknown>['body']>['parse']>;

type TypedJwt<J> = J extends undefined
	? undefined
	: ReturnType<NonNullable<Schema<unknown, unknown, unknown, J>['jwt']>['parse']>;
