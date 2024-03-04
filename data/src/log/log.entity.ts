import { Infer, column, entity, primary } from 'lib/database';

export const logEntity = entity('log', {
	id: primary('uuid'),
	timestamp: column('bigint'),
	level: column('varchar').length(8),
	context: column('varchar').length(32).nullable(),
	message: column('varchar').length(256),
	stack: column('text').nullable(),
});

export type Log = Infer<typeof logEntity>;
