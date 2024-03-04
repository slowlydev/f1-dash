import { Infer, column, entity, primary } from "lib/database";

export const reqEntity = entity("req", {
	id: primary("uuid"),
	ip: column("varchar").length(64),
	timestamp: column("integer"),
	method: column("varchar").length(8),
	endpoint: column("varchar").length(256),
});

export type Req = Infer<typeof reqEntity>;
