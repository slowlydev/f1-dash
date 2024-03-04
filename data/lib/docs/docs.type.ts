import { Method } from '../router/router.type';

type Info = {
	title: string;
	description: string;
	version: string;
};

type Server = {
	url: string;
};

type Schema = {
	type: 'string' | 'number';
};

export type Parameter = {
	in: 'path' | 'query';
	name: string;
	required: boolean;
	schema: Schema;
};

type Response = {
	description: string;
};

export type Responses = Record<string, Response>;

export type RequestBody = {
	required?: boolean;
	content?: {
		'application/json': object;
	};
};

export type Tag = string;

export type Security = {
	bearer: [];
};

export type Operation = {
	operationId?: string;
	parameters?: Parameter[];
	requestBody?: RequestBody;
	responses?: Responses;
	tags?: Tag[];
	security?: Security[];
};

export type Paths = Record<string, Partial<Record<Method, Operation>>>;

export type Components = {
	securitySchemes: {
		bearer: {
			type: 'http';
			scheme: 'bearer';
			bearerFormat: 'jwt';
		};
	};
};

export type Docs = {
	openapi: string;
	info: Info;
	servers: Server[];
	paths: Paths;
	components: Components;
};
