export type Serializer = {
	req: (request: Request) => unknown | Promise<unknown>;
	res: (body: unknown) => string | null;
};
