import { isString } from "../assert/assert";
import { StringParser } from "./string.type";

export const string = (): StringParser => {
	const options: StringParser = {
		type: ["string"],
		base: undefined,
		constraints: { min: undefined, max: undefined },
		optional: () => {
			options.type.push("undefined");
			return options;
		},
		nullable: () => {
			options.type.push("null");
			return options;
		},
		default: (value: string) => {
			options.base = value;
			return options;
		},
		min: (length: number) => {
			options.constraints.min = length;
			return options;
		},
		max: (length: number) => {
			options.constraints.max = length;
			return options;
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		parse: (argument: unknown): any => {
			if (argument === undefined && options.type.includes("undefined") && options.base !== undefined) {
				return options.base;
			}
			if (options.type.includes("undefined") && argument === undefined) {
				return argument;
			}
			if (options.type.includes("null") && argument === null) {
				return argument;
			}
			isString(argument, options.constraints);
			return argument;
		},
	};
	return options;
};
