import { SupportedCryptoAlgorithms } from 'bun';
import { createHash } from 'crypto';

export const hash = (password: string, algorithm: SupportedCryptoAlgorithms): string => {
	return createHash(algorithm).update(password).digest('hex');
};
