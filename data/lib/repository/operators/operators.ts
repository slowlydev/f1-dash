import { IdEntity, Operator, WhereOptions } from '../repository.type';
import { Modifier } from './operators.type';

export const not = <T>(value: T): Modifier<T> => {
	return { operator: '!=', value };
};

export const like = <T>(value: T): Modifier<T> => {
	return { operator: 'like', value };
};

export const moreThan = <T>(value: T): Modifier<T> => {
	return { operator: '>', value };
};

export const lessThan = <T>(value: T): Modifier<T> => {
	return { operator: '<', value };
};

export const moreEqualThan = <T>(value: T): Modifier<T> => {
	return { operator: '>=', value };
};

export const lessEqualThan = <T>(value: T): Modifier<T> => {
	return { operator: '<=', value };
};

export const determineOperator = <T extends IdEntity>(where: WhereOptions<T>, key: keyof T): string => {
	if (where[key] && typeof where[key] === 'object') {
		return (where[key] as { operator: Operator; value: unknown }).operator;
	} else if (where[key] === null) {
		return 'is';
	}
	return '=';
};
