import { Server } from 'bun';
import { Cache } from '../../cache/cache.type';
import { Logger } from '../../logger/logger.type';
import { Route } from '../../router/router.type';
import { Throttle } from '../../throttle/throttle.type';
import { Serializer } from '../serialize/serialize.type';

export type FluxifyServer = Server & {
	timer: Timer;
	routes: Route[];
	cache: Cache[];
	throttle: Throttle;
	logger: (custom: Logger) => void;
	header: (custom: HeadersInit) => void;
	serialize: (custom: Partial<Serializer>) => void;
};
