import { randomInt } from 'crypto';
import { lorem } from '../lorem';

export const word = (length: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12): string => {
	const hits = lorem.filter((lor) => lor.length === length);
	return hits[randomInt(0, hits.length - 1)];
};
