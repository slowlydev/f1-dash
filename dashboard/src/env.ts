import { z } from "zod";

const server = z.object({
	NODE_ENV: z.enum(["development", "test", "production"]),

	API_URL: z.string().min(1).includes("http"),

	TRACKING_ID: z.string().optional(),
	TRACKING_URL: z.string().includes("http").optional(),

	DISABLE_IFRAME: z.string().optional(),
});

const client = z.object({
	NEXT_PUBLIC_LIVE_URL: z.string().min(1).includes("http"),
});

const processEnv = {
	NODE_ENV: process.env.NODE_ENV,

	API_URL: process.env.API_URL,

	TRACKING_ID: process.env.TRACKING_ID,
	TRACKING_URL: process.env.TRACKING_URL,

	DISABLE_IFRAME: process.env.DISABLE_IFRAME,

	NEXT_PUBLIC_LIVE_URL: process.env.NEXT_PUBLIC_LIVE_URL,
};

// Don't touch the part below
// This is used to validate envs and dynamically set the environment variables client-side
// --------------------------

export const PUBLIC_ENV_KEY = "__ENV";

const fullSchema = server.merge(client);
type Env = z.input<typeof fullSchema>;

type SPR = z.SafeParseReturnType<Env, Env>;

declare global {
	interface Window {
		[PUBLIC_ENV_KEY]: Env;
	}
}

let env = process.env as unknown as Env;

if (process.env.SKIP_ENV_VALIDATION !== "1") {
	const isServer = typeof window === "undefined";

	const hasEnv = !isServer && window[PUBLIC_ENV_KEY] !== undefined;

	const syntheticEnv = !hasEnv ? processEnv : window[PUBLIC_ENV_KEY];

	const parsedEnv = isServer ? (fullSchema.safeParse(syntheticEnv) as SPR) : (client.safeParse(syntheticEnv) as SPR);

	if (!parsedEnv.success) {
		const error = parsedEnv.error.flatten().fieldErrors;
		console.error("❌ Invalid environment variables:", error);
		throw new Error("Invalid environment variables");
	}

	env = new Proxy(parsedEnv.data, {
		get(target, prop) {
			if (typeof prop !== "string") return undefined;

			const isPublic = prop.startsWith("NEXT_PUBLIC_");

			if (!isServer && !isPublic)
				throw new Error(
					process.env.NODE_ENV === "production"
						? "❌ Attempted to access a server-side environment variable on the client"
						: `❌ Attempted to access server-side environment variable '${prop}' on the client`,
				);

			return target[prop as keyof typeof target];
		},
	});
}

export { env };
