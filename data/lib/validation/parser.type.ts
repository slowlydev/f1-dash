export type Type =
	| "string"
	| "number"
	| "boolean"
	| "date"
	| "uuid"
	| "object"
	| "array"
	| "union"
	| "undefined"
	| "null"
	| "transform";

export type Infer<T extends Parser<unknown>> = ReturnType<T["parse"]>;

export type ParseFunction<T> = (argument: unknown) => T;

export type DefaultParser<T> = (argument: T) => {
	type: Type[];
	parse: ParseFunction<T>;
};

export type Parser<T> = {
	type: Type[];
	parse: ParseFunction<T>;
};

export type Constraints = Partial<{
	min: number;
	max: number;
}>;

export type RecursiveParser<T, P, D, Called extends keyof T = never> = {
	[K in keyof T as Exclude<K, Called>]: K extends "parse"
		? (argument: P extends undefined | null ? P : unknown) => P
		: K extends "base"
		? P | undefined
		: K extends "type"
		? Type[]
		: K extends "constraints"
		? Constraints
		: K extends "min" | "max"
		? (
				length: number,
		  ) => RecursiveParser<T, K extends "optional" ? P | undefined : K extends "nullable" ? P | null : P, D, Called | K>
		: K extends "default"
		? (value: D) => RecursiveParser<T, D, D, Called | K>
		: () => RecursiveParser<
				T,
				K extends "optional" ? P | undefined : K extends "nullable" ? P | null : P,
				D,
				Called | K
		  >;
};
