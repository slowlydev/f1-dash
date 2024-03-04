import { Env } from 'bun';
import { Method } from '../router/router.type';

export const colorTerminal = (env: Env): boolean => {
	if (env.FORCE_COLOR) {
		return true;
	}
	if (env.NO_COLOR) {
		return false;
	}
	if (env.TERM && env.TERM.includes('color')) {
		return true;
	}
	return false;
};

export const purple = colorTerminal(process.env) ? '\x1b[35m' : '';
export const blue = colorTerminal(process.env) ? '\x1b[34m' : '';
export const cyan = colorTerminal(process.env) ? '\x1b[36m' : '';
export const green = colorTerminal(process.env) ? '\x1b[32m' : '';
export const yellow = colorTerminal(process.env) ? '\x1b[33m' : '';
export const red = colorTerminal(process.env) ? '\x1b[31m' : '';
export const bold = colorTerminal(process.env) ? '\x1b[1m' : '';
export const reset = colorTerminal(process.env) ? '\x1b[0m' : '';

export const colorMethod = (method: Method): string => {
	switch (true) {
		case method === 'options':
			return `${bold}${cyan}${method}${reset}`;
		case method === 'get':
			return `${bold}${blue}${method}${reset}`;
		case method === 'post':
			return `${bold}${green}${method}${reset}`;
		case method === 'put':
			return `${bold}${yellow}${method}${reset}`;
		case method === 'patch':
			return `${bold}${yellow}${method}${reset}`;
		case method === 'delete':
			return `${bold}${red}${method}${reset}`;
		default:
			return `${bold}${method}${reset}`;
	}
};

export const colorStatus = (status: number): string => {
	switch (true) {
		case status >= 600:
			return `${status}`;
		case status >= 500:
			return `${bold}${red}${status}${reset}`;
		case status >= 400:
			return `${bold}${yellow}${status}${reset}`;
		case status >= 300:
			return `${bold}${blue}${status}${reset}`;
		case status >= 200:
			return `${bold}${green}${status}${reset}`;
		case status >= 100:
			return `${bold}${cyan}${status}${reset}`;
		default:
			return `${status}`;
	}
};

export const colorTime = (time: number): string => {
	switch (true) {
		case time <= 1:
			return `${bold}${cyan}${(time * 1000).toFixed(0)}${reset} µs`;
		case time <= 20:
			return `${bold}${cyan}${time.toFixed(2)}${reset} ms`;
		case time <= 40:
			return `${bold}${green}${time.toFixed(2)}${reset} ms`;
		case time <= 80:
			return `${bold}${yellow}${time.toFixed(2)}${reset} ms`;
		case time <= 1000:
			return `${bold}${red}${time.toFixed(2)}${reset} ms`;
		default:
			return `${bold}${red}${(time / 1000).toFixed(2)}${reset} s`;
	}
};

export const colorBytes = (bytes: number | null): string => {
	if (bytes === null) return '';
	switch (true) {
		case bytes <= 2048:
			return `${bold}${cyan}${bytes}${reset} b`;
		case bytes <= 65536:
			return `${bold}${green}${(bytes / 1024).toFixed(2)}${reset} kb`;
		case bytes <= 524288:
			return `${bold}${yellow}${(bytes / 1024).toFixed(2)}${reset} kb`;
		default:
			return `${bold}${red}${(bytes / (1024 * 1024)).toFixed(2)}${reset} mb`;
	}
};
