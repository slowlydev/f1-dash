export class HttpException {
	constructor(status: number, message: string, detail?: string) {
		this.status = status;
		this.message = message;
		this.detail = detail;
	}
	status: number;
	message: string;
	detail?: string;
}

export const Accepted = (detail?: string): HttpException => {
	return new HttpException(202, 'accepted', detail);
};

export const NoContent = (detail?: string): HttpException => {
	return new HttpException(204, 'no content', detail);
};

export const Unauthorized = (detail?: string): HttpException => {
	return new HttpException(401, 'unauthorized', detail);
};

export const Forbidden = (detail?: string): HttpException => {
	return new HttpException(403, 'forbidden', detail);
};

export const NotFound = (detail?: string): HttpException => {
	return new HttpException(404, 'not found', detail);
};

export const MethodNotAllowed = (detail?: string): HttpException => {
	return new HttpException(405, 'method not allowed', detail);
};

export const Conflict = (detail?: string): HttpException => {
	return new HttpException(409, 'conflict', detail);
};

export const Gone = (detail?: string): HttpException => {
	return new HttpException(410, 'gone', detail);
};

export const IamTeapot = (detail?: string): HttpException => {
	return new HttpException(418, 'iam teapot', detail);
};

export const Locked = (detail?: string): HttpException => {
	return new HttpException(423, 'locked', detail);
};

export const TooManyRequests = (detail?: string): HttpException => {
	return new HttpException(429, 'too many requests', detail);
};

export const InternalServerError = (detail?: string): HttpException => {
	return new HttpException(500, 'internal server error', detail);
};
