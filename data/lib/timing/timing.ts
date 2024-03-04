import { config } from '../config/config';
import { FluxifyRequest } from '../router/router.type';
import { Timing } from './timing.type';

export const start = (request: FluxifyRequest, name: Timing, now?: number): void => {
	if (config.stage !== 'prod') {
		request.times.push({ name, start: now ?? performance.now() });
	}
};

export const stop = (request: FluxifyRequest, name: Timing, now?: number): void => {
	if (config.stage !== 'prod') {
		const index = request.times.findIndex((time) => time.name === name);
		request.times[index].stop = now ?? performance.now();
	}
};

export const timing = (request: FluxifyRequest): object => {
	if (config.stage !== 'prod' && request.times.length) {
		return {
			'server-timing': request.times
				.map((time) => (time.stop ? `${time.name};dur=${(time.stop - time.start).toFixed(6)}` : null))
				.filter((time) => time !== null)
				.join(','),
		};
	}
	return {};
};
