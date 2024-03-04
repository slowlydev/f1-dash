import { Infer, column, entity, primary } from "lib/database";

export const resEntity = entity("res", {
	id: primary("uuid"),
	timestamp: column("integer"),
	status: column("int"),
	time: column("float"),
	bytes: column("int").nullable(),
});

export type Res = Infer<typeof resEntity>;
