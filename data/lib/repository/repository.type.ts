export type NullablePartial<
	T,
	NK extends keyof T = { [K in keyof T]: null extends T[K] ? K : never }[keyof T],
	NP = Partial<Pick<T, NK>> & Pick<T, Exclude<keyof T, NK>>,
> = { [K in keyof NP]: NP[K] };

export type IdEntity = {
	id: string | number;
	[key: string]: unknown;
};

export type Operator = '!=' | 'like' | '<' | '>' | '<=' | '>=';

export type SelectOptions<T, S extends keyof T> = Partial<Record<S, boolean>>;

export type WhereOptions<T> = Partial<{ [K in keyof T]: T[K] | { operator: Operator; value: T[K] } }>;

export type FindOptions<T, S extends keyof T> = {
	select?: SelectOptions<T, S>;
	where?: WhereOptions<T> | WhereOptions<T>[];
	order?: Partial<Record<keyof T, 'asc' | 'desc'>>;
	skip?: number;
	take?: number;
	deleted?: boolean;
};

export type FindOneOptions<T, S extends keyof T> = {
	select?: SelectOptions<T, S>;
	where: WhereOptions<T> | WhereOptions<T>[];
	deleted?: boolean;
};

export type OptionalKeys = 'id' | 'createdAt' | 'updatedAt' | 'deletedAt';

export type InsertData<T extends IdEntity> = NullablePartial<Omit<T, OptionalKeys>> & { [K in OptionalKeys]?: T[K] };

export type UpdateData<T extends IdEntity> = NullablePartial<Partial<Omit<T, 'id'>>>;
