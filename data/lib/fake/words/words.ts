import { randomInt } from 'crypto';
import { lorem } from '../lorem';

export const words = (amount: number): string => {
	return Array(amount)
		.fill(null)
		.map(() => lorem[randomInt(0, lorem.length - 1)])
		.join(' ');
};
