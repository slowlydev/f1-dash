import EventEmitter from 'events';
import { defaultHeaders } from '../core/response/response';
import { debug, info } from '../logger/logger';

export const emitter = new EventEmitter();
emitter.setMaxListeners(2048);

export const subscribe = (req: Request, channel: string, data?: unknown): Response => {
	return new Response(
		new ReadableStream({
			type: 'direct',
			pull(controller: ReadableStreamDirectController) {
				let id = +(req.headers.get('last-event-id') ?? 1);
				const handler = async (dat: unknown): Promise<void> => {
					await controller.write(`id:${id}\ndata:${dat !== undefined ? JSON.stringify(dat) : ''}\n\n`);
					await controller.flush();
					id++;
				};
				info(`subscribing to channel '${channel}'`);
				emitter.on(channel, handler);
				req.signal.onabort = () => {
					info(`unsubscribing from channel '${channel}'`);
					emitter.off(channel, handler);
				};
				if (data) void handler(data);
				return new Promise(() => void 0);
			},
		}),
		{
			status: 200,
			headers: { ...defaultHeaders, 'content-type': 'text/event-stream;charset=utf-8' },
		},
	);
};

export const emit = (channel: string, data?: unknown): void => {
	debug(`emitting to channel '${channel}'`);
	emitter.emit(channel, data);
};
