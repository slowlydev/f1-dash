import { env } from "../env.mjs";

export const sseSession = (endpoint: string) => {
	return new EventSource(`${env.NEXT_PUBLIC_SERVER_URL}/${endpoint}`);
};
