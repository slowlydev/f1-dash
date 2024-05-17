const isObject = (obj: any): boolean => {
	return obj !== null && typeof obj === "object" && !Array.isArray(obj);
};

export const merge = (base: any, update: any): any => {
	if (isObject(base) && isObject(update)) {
		const result = { ...base };

		for (const [key, value] of Object.entries(update)) {
			result[key] = merge(base[key] ?? null, value);
		}

		return result;
	}

	if (Array.isArray(base) && Array.isArray(update)) {
		return base.concat(update);
	}

	if (Array.isArray(base) && isObject(update)) {
		const result = [...base];

		for (const [key, value] of Object.entries(update)) {
			const index = parseInt(key);
			result.splice(index, 1, merge(result[index], value));
		}

		return [...result];
	}

	return update;
};
