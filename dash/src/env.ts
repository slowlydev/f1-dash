import { z } from "zod";

const server = z.object({
	NODE_ENV: z.enum(["development", "test", "production"]),
});

const client = z.object({
	NEXT_PUBLIC_LIVE_SOCKET_URL: z.string().min(1).includes("http"),
	NEXT_PUBLIC_API_URL: z.string().min(1).includes("http"),
	NEXT_PUBLIC_ENABLE_TRACKING: z.string().optional(),

	NEXT_PUBLIC_MAP_KEY: z.string().min(1),
});

const processEnv = {
	NODE_ENV: process.env.NODE_ENV,
	NEXT_PUBLIC_LIVE_SOCKET_URL: process.env.NEXT_PUBLIC_LIVE_SOCKET_URL,
	NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
	NEXT_PUBLIC_ENABLE_TRACKING: process.env.NEXT_PUBLIC_ENABLE_TRACKING,
	NEXT_PUBLIC_MAP_KEY: process.env.NEXT_PUBLIC_MAP_KEY,
};

// Don't touch the part below
// --------------------------
const merged = server.merge(client);

type MergedInput = z.input<typeof merged>;
type MergedOutput = z.infer<typeof merged>;
type MergedSafeParseReturn = z.SafeParseReturnType<MergedInput, MergedOutput>;

let env = process.env as unknown as MergedOutput;

const skip =
	!!process.env.SKIP_ENV_VALIDATION &&
	process.env.SKIP_ENV_VALIDATION !== "false" &&
	process.env.SKIP_ENV_VALIDATION !== "0";

if (!skip) {
	const isServer = typeof window === "undefined";

	const parsed = isServer
		? (merged.safeParse(processEnv) as MergedSafeParseReturn) // on server we can validate all env vars
		: (client.safeParse(processEnv) as MergedSafeParseReturn); // on client we can only validate the ones that are exposed

	if (parsed.success === false) {
		console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors);
		throw new Error("Invalid environment variables");
	}

	env = new Proxy(parsed.data, {
		get(target, prop) {
			if (typeof prop !== "string") return undefined;
			// Throw a descriptive error if a server-side env var is accessed on the client
			// Otherwise it would just be returning `undefined` and be annoying to debug
			if (!isServer && !prop.startsWith("NEXT_PUBLIC_"))
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
