import { Method } from '../router/router.type';

export type LoggerRequest = { id: string; timestamp: number; ip: string; method: Method; endpoint: string };
export type LoggerResponse = { id: string; timestamp: number; status: number; time: number; bytes: number };
export type LoggerTrace = { timestamp: number; context: string | null; message: string; stack?: unknown };
export type LoggerDebug = { timestamp: number; context: string | null; message: string };
export type LoggerInfo = { timestamp: number; context: string | null; message: string };
export type LoggerWarn = { timestamp: number; context: string | null; message: string };
export type LoggerError = { timestamp: number; context: string | null; message: string; stack?: unknown };

export type Logger = {
	req?: ({ id, timestamp, ip, method, endpoint }: LoggerRequest) => Promise<void> | void;
	res?: ({ id, timestamp, status, time, bytes }: LoggerResponse) => Promise<void> | void;
	trace?: ({ timestamp, message, stack }: LoggerTrace) => Promise<void> | void;
	debug?: ({ timestamp, message }: LoggerDebug) => Promise<void> | void;
	info?: ({ timestamp, message }: LoggerInfo) => Promise<void> | void;
	warn?: ({ timestamp, message }: LoggerWarn) => Promise<void> | void;
	error?: ({ timestamp, message, stack }: LoggerError) => Promise<void> | void;
};
