import { error, info } from '../../logger/logger';
import { extractExports, filterFiles, searchFiles } from './helper';

const matchingFiles = filterFiles(searchFiles('./src', /\.seed\.ts$/), process.argv[2]);
const seeds = await extractExports(matchingFiles);

if (seeds.length === 0) {
	info('no seeds found for running');
} else {
	info(`found ${seeds.length} seeds to run`);
}

await (async (): Promise<void> => {
	for (const seed of seeds) {
		if (seed && seed instanceof Function) {
			info(`running seed ${seed.name}...`);
			try {
				await seed();
			} catch (err) {
				error(`failed to run seed ${seed.name}`, err);
			}
		}
	}
})();
