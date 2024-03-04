import { isObject } from "../assert/assert";
import { ValidationError } from "../error";
import { Parser, Type } from "../parser.type";
import { ObjectParser } from "./object.type";

export const keyIsNot = (name: string, type: Type[], value?: unknown): ValidationError => {
	return new ValidationError(
		`${name} is not of type ${type.length > 1 ? type.join(" | ") : type[0]} (${
			value === null ? "null" : Array.isArray(value) ? "array" : typeof value
		} given)`,
	);
};

export const keyIsMissing = (name: string, type: Type): ValidationError => {
	return new ValidationError(`${name} is missing and should be of type ${type}`);
};

export const keyNotWanted = (name: string): ValidationError => {
	return new ValidationError(`${name} should not exist`);
};

export const object = <T, S extends Record<string, Parser<T>>>(
	schema: S,
): ObjectParser<{ [K in keyof S]: ReturnType<S[K]["parse"]> }> => {
	function validate(argument: unknown): asserts argument is {
		[K in keyof S]: ReturnType<S[K]["parse"]>;
	} {
		isObject(argument);
		for (const key of Object.keys(schema)) {
			if (key in argument) {
				try {
					(argument as Record<string, unknown>)[key] = schema[key].parse(argument[key as keyof typeof argument]);
				} catch (err) {
					throw new ValidationError(
						(err as ValidationError).message.replace(`"${argument[key as keyof typeof argument]}"`, key),
					);
				}
			} else {
				if (argument[key as keyof typeof argument] === undefined && !schema[key].type.includes("undefined")) {
					throw keyIsMissing(key, schema[key].type[0]);
				} else if (!schema[key].type.includes("undefined")) {
					throw keyIsNot(key, schema[key].type, argument[key as keyof typeof argument]);
				} else {
					(argument as Record<string, unknown>)[key] = schema[key].parse(argument[key as keyof typeof argument]);
				}
			}
		}
		const extras = Object.keys(argument).filter((key) => !schema[key]);
		if (extras.length > 0) {
			throw keyNotWanted(extras[0]);
		}
	}

	const options = {
		type: ["object"] as Type[],
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
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		parse: (argument: unknown): any => {
			if (options.type.includes("undefined") && argument === undefined) {
				return argument;
			}
			if (options.type.includes("null") && argument === null) {
				return argument;
			}
			validate(argument);
			return argument;
		},
	};
	return options;
};
