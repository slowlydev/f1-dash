import pack from '../../package.json';
import { config } from '../config/config';
import { routes } from '../router/router';
import { Docs, Operation, Parameter, Paths, RequestBody, Responses, Security, Tag } from './docs.type';

export const generateDocs = (): Docs => {
	const paths: Paths = {};
	const endpoints = [...new Set(routes.map((route) => route.endpoint))];
	endpoints.forEach((endpoint) => {
		const methods: Paths[''] = {};
		routes
			.filter((route) => route.endpoint === endpoint)
			.forEach((route) => {
				const parameters: Parameter[] = [];
				if (route.endpoint.includes(':')) {
					const params = route.endpoint.split('/').filter((frag) => frag.includes(':'));
					params.forEach((param) =>
						parameters.push({
							in: 'path',
							name: param.substring(1),
							required: true,
							schema: { type: 'string' },
						}),
					);
				}
				const responses: Responses = {};
				const tags: Tag[] = [];
				const tag = route.endpoint.split('/')[1];
				if (tag) tags.push(route.endpoint.split('/')[config.globalPrefix ? 2 : 1]);
				responses[route.method === 'post' ? '201' : '200'] = {
					description: '',
				};
				if (route.schema) {
					responses['400'] = {
						description: '',
					};
				}
				const requestBody: RequestBody = {};
				if (route.schema?.body) {
					requestBody.required = true;
					requestBody.content = {
						'application/json': {},
					};
				}
				const security: Security[] = [];
				if (route.schema?.jwt) security.push({ bearer: [] });
				const operation: Operation = {};
				if (route.handler.toString().includes('return ')) {
					operation.operationId = route.handler.toString().split('return ')[1].split('(')[0];
				}
				if (parameters.length) operation.parameters = parameters;
				if (Object.values(requestBody).length) operation.requestBody = requestBody;
				if (Object.values(responses).length) operation.responses = responses;
				if (tags.length) operation.tags = tags;
				if (security.length) operation.security = security;
				methods[route.method] = operation;
			});
		const processedEndpoint = endpoint
			.split('/')
			.map((frag) => (frag.includes(':') ? `{${frag.substring(1)}}` : frag))
			.join('/');
		paths[processedEndpoint] = methods;
	});

	const docs: Docs = {
		openapi: '3.0.0',
		info: {
			title: pack.name,
			description: pack.description,
			version: pack.version,
		},
		servers: [
			{
				url: `${config.globalPrefix ?? '/'}`,
			},
		],
		paths,
		components: {
			securitySchemes: {
				bearer: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'jwt',
				},
			},
		},
	};

	return docs;
};
