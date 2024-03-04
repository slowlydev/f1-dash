import { runQuery } from 'lib/database';
import { debug, error } from 'lib/logger';

const keys = (input: string): string[] => {
	return input
		.split(',')
		.map((frag) => frag.split(' ')[0])
		.map((key) => (key.startsWith('(') ? key.substring(1) : key))
		.filter((key) => key !== 'id');
};

export const migrate = (name: string, before: string, after: string): void => {
	const oldRaw = keys(before);
	const newRaw = keys(after);
	const filteredOld = oldRaw.filter((key) => newRaw.includes(key));
	const filteredNew = newRaw.filter((key) => oldRaw.includes(key));
	const oldKeys = filteredOld.map((key, ind) => `${filteredNew[ind]} as ${key}`).join(',');
	const newKeys = filteredNew.join(',');
	runQuery('pragma foreign_keys = off');
	try {
		debug(`migrating schema for table '${name}'`);
		runQuery(`create table ${name}_migration ${after}`);
		runQuery(`insert into ${name}_migration (id,${newKeys}) select id,${oldKeys} from ${name}`);
		runQuery(`drop table ${name}`);
		runQuery(`create table ${name} ${after}`);
		runQuery(`insert into ${name} (id,${newKeys}) select id,${newKeys} from ${name}_migration`);
	} catch (err) {
		error(`failed to migrate table '${name}'`, err);
	}
	runQuery(`drop table ${name}_migration`);
	runQuery('pragma foreign_keys = on');
};
