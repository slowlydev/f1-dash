import { config } from '../config/config';
import { FluxifyResponse, HandlerSchema, Path, Route, Schema } from './router.type';

export const routes: Route[] = [];

type Router = {
	all: <P, Q, B, J>(
		endpoint: Path,
		schema: Schema<P, Q, B, J> | null,
		handler: ({ param, query, body, jwt }: HandlerSchema<P, Q, B, J>) => FluxifyResponse,
	) => void;
	get: <P, Q, B, J>(
		endpoint: Path,
		schema: Schema<P, Q, B, J> | null,
		handler: ({ param, query, body, jwt }: HandlerSchema<P, Q, B, J>) => FluxifyResponse,
	) => void;
	post: <P, Q, B, J>(
		endpoint: Path,
		schema: Schema<P, Q, B, J> | null,
		handler: ({ param, query, body, jwt }: HandlerSchema<P, Q, B, J>) => FluxifyResponse,
	) => void;
	put: <P, Q, B, J>(
		endpoint: Path,
		schema: Schema<P, Q, B, J> | null,
		handler: ({ param, query, body, jwt }: HandlerSchema<P, Q, B, J>) => FluxifyResponse,
	) => void;
	patch: <P, Q, B, J>(
		endpoint: Path,
		schema: Schema<P, Q, B, J> | null,
		handler: ({ param, query, body, jwt }: HandlerSchema<P, Q, B, J>) => FluxifyResponse,
	) => void;
	delete: <P, Q, B, J>(
		endpoint: Path,
		schema: Schema<P, Q, B, J> | null,
		handler: ({ param, query, body, jwt }: HandlerSchema<P, Q, B, J>) => FluxifyResponse,
	) => void;
};

export const fuseEndpoint = (endpoint: Path, prefix: string, version?: number, base?: Path): string => {
	const fragments: string[] = [
		typeof endpoint === 'object' && endpoint.prefix !== undefined
			? endpoint.prefix
			: typeof base === 'object' && base.prefix !== undefined
			? base.prefix
			: prefix,
		typeof endpoint === 'object' && endpoint.version
			? `v${endpoint.version}`
			: typeof base === 'object' && base.version
			? `v${base.version}`
			: version
			? `v${version}`
			: '',
		typeof base === 'object' ? base.path : base ?? '',
		typeof endpoint === 'object' ? endpoint.path : endpoint,
	];
	return (
		fragments
			.filter((frag) => frag.length)
			.map((frag) => (frag.startsWith('/') ? frag : `/${frag}`))
			.map((frag) => (frag.endsWith('/') ? frag.substring(0, frag.length - 1) : frag))
			.join('') || '/'
	);
};

export const router = (base?: Path): Router => {
	return {
		all<P, Q, B, J>(
			endpoint: Path,
			schema: Schema<P, Q, B, J> | null,
			handler: ({ param, query, body, jwt }: HandlerSchema<P, Q, B, J>) => FluxifyResponse,
		): void {
			routes.push({
				method: 'all',
				schema,
				endpoint: fuseEndpoint(endpoint, config.globalPrefix, config.defaultVersion, base),
				handler,
			});
		},

		get<P, Q, B, J>(
			endpoint: Path,
			schema: Schema<P, Q, B, J> | null,
			handler: ({ param, query, body, jwt }: HandlerSchema<P, Q, B, J>) => FluxifyResponse,
		): void {
			routes.push({
				method: 'get',
				schema,
				endpoint: fuseEndpoint(endpoint, config.globalPrefix, config.defaultVersion, base),
				handler,
			});
		},

		post<P, Q, B, J>(
			endpoint: Path,
			schema: Schema<P, Q, B, J> | null,
			handler: ({ param, query, body, jwt }: HandlerSchema<P, Q, B, J>) => FluxifyResponse,
		): void {
			routes.push({
				method: 'post',
				schema,
				endpoint: fuseEndpoint(endpoint, config.globalPrefix, config.defaultVersion, base),
				handler,
			});
		},

		put<P, Q, B, J>(
			endpoint: Path,
			schema: Schema<P, Q, B, J> | null,
			handler: ({ param, query, body, jwt }: HandlerSchema<P, Q, B, J>) => FluxifyResponse,
		): void {
			routes.push({
				method: 'put',
				schema,
				endpoint: fuseEndpoint(endpoint, config.globalPrefix, config.defaultVersion, base),
				handler,
			});
		},

		patch<P, Q, B, J>(
			endpoint: Path,
			schema: Schema<P, Q, B, J> | null,
			handler: ({ param, query, body, jwt }: HandlerSchema<P, Q, B, J>) => FluxifyResponse,
		): void {
			routes.push({
				method: 'patch',
				schema,
				endpoint: fuseEndpoint(endpoint, config.globalPrefix, config.defaultVersion, base),
				handler,
			});
		},

		delete<P, Q, B, J>(
			endpoint: Path,
			schema: Schema<P, Q, B, J> | null,
			handler: ({ param, query, body, jwt }: HandlerSchema<P, Q, B, J>) => FluxifyResponse,
		): void {
			routes.push({
				method: 'delete',
				schema,
				endpoint: fuseEndpoint(endpoint, config.globalPrefix, config.defaultVersion, base),
				handler,
			});
		},
	};
};
