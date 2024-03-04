export type Tab = {
	schedule: string;
	handler: () => void | Promise<void>;
};
