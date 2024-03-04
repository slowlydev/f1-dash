import { Server } from 'bun';
import { config } from '../../config/config';
import { ValidationError } from '../../validation/error';
import { serializer } from '../serialize/serialize';

export const parseIp = (request: Request, server: Server): string => {
	const forwarded = request.headers.get('x-forwarded-for');
	if (forwarded) return forwarded;
	// FIXME: remove testing shenanigans when bun fixes request ip undefined in testing
	const ip = config.stage === 'test' ? null : server.requestIP(request);
	return ip ? ip.address : '';
};

export const parseBody = async (request: Request): Promise<unknown | null> => {
	try {
		if (request.body) {
			const body = await serializer.req(request);
			return body;
		} else {
			return null;
		}
	} catch (err) {
		throw new ValidationError((err as { message?: string }).message);
	}
};
