import { createHmac } from 'crypto';
import { config } from '../config/config';
import { Unauthorized } from '../exception/exception';
import { HeadDto, JwtDto, headDto, jwtDto } from './jwt.dto';

export const signJwt = (data: { id: string }): string => {
	const header: HeadDto = { alg: 'HS256', typ: 'JWT' };
	const payload: JwtDto = {
		...data,
		iat: Math.floor(Date.now() / 1000),
		exp: Math.floor(Date.now() / 1000) + config.jwtExpiry,
	};

	const base64Header = encodeFragment(JSON.stringify(header));
	const base64Payload = encodeFragment(JSON.stringify(payload));
	const signature = createHmac('sha256', config.jwtSecret)
		.update(`${base64Header}.${base64Payload}`)
		.digest('base64')
		.replace(/=/g, '')
		.replace(/\+/g, '-')
		.replace(/\//g, '_');

	return `${base64Header}.${base64Payload}.${signature}`;
};

const encodeFragment = (input: string): string => {
	return Buffer.from(input).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
};

const decodeFragment = (fragment: string): Record<string, unknown> => {
	const base64 = fragment.replace(/-/g, '+').replace(/_/g, '/');
	const jsonPayload = decodeURIComponent(
		atob(base64)
			.split('')
			.map((char) => '%' + ('00' + char.charCodeAt(0).toString(16)).slice(-2))
			.join(''),
	);
	return JSON.parse(jsonPayload);
};

export const verifyJwt = (token: string): JwtDto => {
	if (!token.includes('.') || token.split('.').length !== 3) {
		throw Unauthorized();
	}

	const [header, payload, signature] = token.split('.');

	const head = headDto.parse(decodeFragment(header));
	if (head.alg !== 'HS256' || head.typ !== 'JWT') {
		throw Unauthorized();
	}

	const data = jwtDto.parse(decodeFragment(payload));
	if (data.iat + config.jwtExpiry < data.exp) {
		throw Unauthorized();
	}

	const computedSignature = createHmac('sha256', config.jwtSecret)
		.update(`${header}.${payload}`)
		.digest('base64')
		.replace(/=/g, '')
		.replace(/\+/g, '-')
		.replace(/\//g, '_');

	if (computedSignature !== signature) {
		throw Unauthorized();
	}

	return data;
};
