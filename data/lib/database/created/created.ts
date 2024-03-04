import { CreatedParser } from './created.type';

export const created = (): CreatedParser => {
	const options: CreatedParser = {
		type: 'datetime',
		constraints: {
			name: undefined,
			default: `(datetime('now'))`,
			hooks: {
				onInsert: `(datetime('now'))`,
			},
		},
		name: (name: string) => {
			options.constraints.name = name;
			return options;
		},
		parse: (argument: unknown) => {
			return argument as Date;
		},
	};
	return options;
};
