import { config } from '../../config/config';
import { debug, res } from '../../logger/logger';
import { FluxifyRequest } from '../../router/router.type';
import { start, stop, timing } from '../../timing/timing';
import { serializer } from '../serialize/serialize';

let customHeaders: HeadersInit = {};

export const defaultHeaders = {
	server: 'bun',
	connection: 'keep-alive',
	'keep-alive': 'timeout=5',
	'content-type': 'application/json;charset=utf-8',
	'access-control-allow-origin': config.allowOrigin,
};

export const header = (custom: HeadersInit): void => {
	debug(`registered ${Object.keys(custom).length} custom header`);
	customHeaders = custom;
};

export const createResponse = (
	body: unknown | null,
	status: number,
	request: FluxifyRequest,
	headers?: HeadersInit,
): Response => {
	start(request, 'response');
	const data = body ? serializer.res(body) : null;
	stop(request, 'response');
	const end = performance.now();
	const diff = end - request.time;
	start(request, 'total', request.time);
	stop(request, 'total', end);
	res(request.id, status, diff, data ? data.length : 0);
	return new Response(data, {
		status,
		headers: { ...defaultHeaders, ...customHeaders, ...timing(request), ...headers },
	});
};
