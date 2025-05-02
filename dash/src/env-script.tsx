import { connection } from "next/server";
import Script from "next/script";

import { PUBLIC_ENV_KEY } from "@/env";

// only list env vars that can be exposed to the client

export const getPublicEnv = () => ({
	NEXT_PUBLIC_LIVE_URL: process.env.NEXT_PUBLIC_LIVE_URL,
	NEXT_PUBLIC_MAP_KEY: process.env.NEXT_PUBLIC_MAP_KEY,
});

export default async function EnvScript() {
	await connection();

	const env = getPublicEnv();

	const innerHTML = {
		__html: `window['${PUBLIC_ENV_KEY}'] = ${JSON.stringify(env)}`,
	};

	return <Script id="public-env" strategy={"beforeInteractive"} dangerouslySetInnerHTML={innerHTML} />;
}
