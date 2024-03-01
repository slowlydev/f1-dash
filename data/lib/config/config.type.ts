export type Config = {
	name: string;
	port: number;
	f1BaseUrl: string;
	f1NegotiateUrl: string;
	testing: boolean;
	logLevel: "trace" | "debug" | "info" | "warn" | "error";
};
