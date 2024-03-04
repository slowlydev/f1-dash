import { isNumber } from "../assert/assert";
import { NumberParser } from "./number.type";

export const number = (): NumberParser => {
	const options: NumberParser = {
		type: ["number"],
		base: undefined,
		constraints: { min: undefined, max: undefined },
		transform: () => {
			options.type.push("transform");
			return options;
		},
		optional: () => {
			options.type.push("undefined");
			return options;
		},
		nullable: () => {
			options.type.push("null");
			return options;
		},
		default: (value: number) => {
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
			if (
				options.type.includes("transform") &&
				typeof argument === "string" &&
				typeof +argument === "number" &&
				!isNaN(+argument)
			) {
				isNumber(+argument, options.constraints);
				return +argument;
			}
			if (options.type.includes("undefined") && argument === undefined) {
				return argument;
			}
			if (options.type.includes("null") && argument === null) {
				return argument;
			}
			isNumber(argument, options.constraints);
			return argument;
		},
	};
	return options;
};
