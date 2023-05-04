import { env } from "../env.mjs";

export const sseSession = () => {
  return new EventSource(`${env.NEXT_PUBLIC_SERVER_URL}/sse`);
};
