type TAllKeys<T> = T extends any ? keyof T : never;

type TIndexValue<T, K extends PropertyKey, D = never> = T extends any ? (K extends keyof T ? T[K] : D) : never;

type TPartialKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>> extends infer O
	? { [P in keyof O]: O[P] }
	: never;

type TFunction = (...a: any[]) => any;

type TPrimitives = string | number | boolean | bigint | symbol | Date | TFunction;

type TMerged<T> = [T] extends [Array<any>]
	? { [K in keyof T]: TMerged<T[K]> }
	: [T] extends [TPrimitives]
	? T
	: [T] extends [object]
	? TPartialKeys<{ [K in TAllKeys<T>]: TMerged<TIndexValue<T, K>> }, never>
	: T;

const isObject = (obj: any) => {
	if (typeof obj === "object" && obj !== null) {
		if (typeof Object.getPrototypeOf === "function") {
			const prototype = Object.getPrototypeOf(obj);
			return prototype === Object.prototype || prototype === null;
		}

		return Object.prototype.toString.call(obj) === "[object Object]";
	}

	return false;
};

interface Object {
	[key: string]: any;
}

const merge = <T extends Object[]>(...objects: T): TMerged<T[number]> =>
	objects.reduce((result, current) => {
		if (Array.isArray(current)) {
			throw new TypeError("Arguments provided to ts-deepmerge must be objects, not arrays.");
		}

		Object.keys(current).forEach((key) => {
			if (["__proto__", "constructor", "prototype"].includes(key)) {
				return;
			}

			if (Array.isArray(result[key]) && Array.isArray(current[key])) {
				result[key] = merge.options.mergeArrays
					? Array.from(new Set((result[key] as unknown[]).concat(current[key])))
					: current[key];
			} else if (isObject(result[key]) && isObject(current[key])) {
				result[key] = merge(result[key] as Object, current[key] as Object);
			} else {
				result[key] = current[key];
			}
		});

		return result;
	}, {}) as any;

interface IOptions {
	mergeArrays: boolean;
}

const defaultOptions: IOptions = {
	mergeArrays: true,
};

merge.options = defaultOptions;

merge.withOptions = <T extends Object[]>(options: Partial<IOptions>, ...objects: T) => {
	merge.options = {
		mergeArrays: true,
		...options,
	};

	const result = merge(...objects);

	merge.options = defaultOptions;

	return result;
};

export default merge;
