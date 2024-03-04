import { config } from '../config/config';
import { Config } from '../config/config.type';
import { FluxifyRequest, Method } from '../router/router.type';
import {
	blue,
	bold,
	colorBytes,
	colorMethod,
	colorStatus,
	colorTime,
	cyan,
	green,
	purple,
	red,
	reset,
	yellow,
} from './color';
import { Logger } from './logger.type';

const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;

export const customLogger: Logger = {};

export const getContext = (): string | null => {
	try {
		const stackTrace = new Error().stack;
		const callerLine = stackTrace?.split('\n')[3];
		const filepath = callerLine?.split('(')[1];
		const file = filepath?.split('/').pop();
		const filename = file?.split(':')[0];
		return filename?.endsWith('.ts') ? filename : null;
	} catch {
		return null;
	}
};

export const formatTimestamp = (timestamp: number): string => {
	const date = new Date(timestamp);
	const hour = date.getHours().toString().padStart(2, '0');
	const minute = date.getMinutes().toString().padStart(2, '0');
	const second = date.getSeconds().toString().padStart(2, '0');
	return `${hour}:${minute}:${second}`;
};

export const makeBase = (timestamp: number, variant: Config['logLevel'] | 'req' | 'res'): string => {
	const name = `${bold}${blue}[${config.name}]${reset}`;
	return `${name} (${config.stage}) ${formatTimestamp(timestamp)} ${makeLevel(variant)}`;
};

export const makeLevel = (logLevel: Config['logLevel'] | 'req' | 'res'): string => {
	switch (true) {
		case logLevel === 'req':
			return `${bold}req${reset}:`;
		case logLevel === 'res':
			return `${bold}res${reset}:`;
		case logLevel === 'trace':
			return `${bold}${purple}trace${reset}:`;
		case logLevel === 'debug':
			return `${bold}${cyan}debug${reset}:`;
		case logLevel === 'info':
			return `${bold}${green}info${reset}:`;
		case logLevel === 'warn':
			return `${bold}${yellow}warn${reset}:`;
		case logLevel === 'error':
			return `${bold}${red}error${reset}:`;
		default:
			return `${bold}${logLevel}${reset}`;
	}
};

export const logger = (custom: Logger): void => {
	if (custom.req) {
		debug('adding logger hook for req');
		customLogger.req = custom.req;
	}
	if (custom.res) {
		debug('adding logger hook for res');
		customLogger.res = custom.res;
	}
	if (custom.trace) {
		debug('adding logger hook for trace');
		customLogger.trace = custom.trace;
	}
	if (custom.debug) {
		debug('adding logger hook for debug');
		customLogger.debug = custom.debug;
	}
	if (custom.info) {
		debug('adding logger hook for info');
		customLogger.info = custom.info;
	}
	if (custom.warn) {
		debug('adding logger hook for warn');
		customLogger.warn = custom.warn;
	}
	if (custom.error) {
		debug('adding logger hook for error');
		customLogger.error = custom.error;
	}
};

export const mask = (uuid: string): string => {
	const length = uuid.length;
	if (length < 4) {
		return uuid;
	}
	const head = uuid.substring(0, 2);
	const tail = uuid.substring(length - 2, length);
	return `${head}..${tail}`;
};

export const req = (request: FluxifyRequest, method: Method, endpoint: string): void => {
	if (config.logRequests) {
		const timestamp = Date.now();
		const masked = endpoint.replace(uuidRegex, (uuid) => mask(uuid));
		console.log(`${makeBase(timestamp, 'req')} ${colorMethod(method)} ${masked} from ${mask(request.ip)}`);
		if (customLogger.req) {
			void customLogger.req({ id: request.id, timestamp, ip: request.ip, method, endpoint });
		}
	}
};

export const res = (id: FluxifyRequest['id'], status: number, time: number, bytes: number): void => {
	if (config.logResponses) {
		const timestamp = Date.now();
		console.log(`${makeBase(timestamp, 'res')} ${colorStatus(status)} took ${colorTime(time)} ${colorBytes(bytes)}`);
		if (customLogger.res) {
			void customLogger.res({ id, timestamp, status, time, bytes });
		}
	}
};

export const trace = (message: string | (() => string), stack?: unknown): void => {
	const logLevels: Config['logLevel'][] = ['trace'];
	if (logLevels.includes(config.logLevel)) {
		message = message instanceof Function ? message() : message;
		const timestamp = Date.now();
		const context = getContext();
		console.trace(`${makeBase(timestamp, 'trace')} ${message}`, stack ?? '');
		if (customLogger.trace) {
			void customLogger.trace({ timestamp, context, message, stack });
		}
	}
};

export const debug = (message: string | (() => string)): void => {
	const logLevels: Config['logLevel'][] = ['trace', 'debug'];
	if (logLevels.includes(config.logLevel)) {
		message = message instanceof Function ? message() : message;
		const timestamp = Date.now();
		const context = getContext();
		console.debug(`${makeBase(timestamp, 'debug')} ${message}`);
		if (customLogger.debug) {
			void customLogger.debug({ timestamp, context, message });
		}
	}
};

export const info = (message: string | (() => string)): void => {
	const logLevels: Config['logLevel'][] = ['trace', 'debug', 'info'];
	if (logLevels.includes(config.logLevel)) {
		message = message instanceof Function ? message() : message;
		const timestamp = Date.now();
		const context = getContext();
		console.info(`${makeBase(timestamp, 'info')} ${message}`);
		if (customLogger.info) {
			void customLogger.info({ timestamp, context, message });
		}
	}
};

export const warn = (message: string | (() => string)): void => {
	const logLevels: Config['logLevel'][] = ['trace', 'debug', 'info', 'warn'];
	if (logLevels.includes(config.logLevel)) {
		message = message instanceof Function ? message() : message;
		const timestamp = Date.now();
		const context = getContext();
		console.warn(`${makeBase(timestamp, 'warn')} ${message}`);
		if (customLogger.warn) {
			void customLogger.warn({ timestamp, context, message });
		}
	}
};

export const error = (message: string | (() => string), stack?: unknown): void => {
	const logLevels: Config['logLevel'][] = ['trace', 'debug', 'info', 'warn', 'error'];
	if (logLevels.includes(config.logLevel)) {
		message = message instanceof Function ? message() : message;
		const timestamp = Date.now();
		const context = getContext();
		console.error(`${makeBase(timestamp, 'error')} ${message}`, stack ?? '');
		if (customLogger.error) {
			void customLogger.error({ timestamp, context, message, stack });
		}
	}
};
