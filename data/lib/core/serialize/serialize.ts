import { debug } from '../../logger/logger';
import { Serializer } from './serialize.type';

export const serializer: Serializer = {
	req: (request) => request.json(),
	res: (body) => JSON.stringify(body),
};

export const serialize = (custom: Partial<Serializer>): void => {
	if (custom.req) {
		debug(`using custom request serializer`);
		serializer.req = custom.req;
	}
	if (custom.res) {
		debug(`using custom response serializer`);
		serializer.res = custom.res;
	}
};
