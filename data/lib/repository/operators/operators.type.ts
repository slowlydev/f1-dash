import { Operator } from '../repository.type';

export type Modifier<T> = { operator: Operator; value: T };
