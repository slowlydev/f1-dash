import { DriverType } from "./driver.type";

export type DriverPositionBatch = {
	utc: string;
	positions: DriverPosition[];
};

export type DriverPosition = {
	driverNr: string;
	position: string;

	broadcastName: string;
	fullName: string;
	firstName: string;
	lastName: string;
	short: string;

	teamColor: string;

	status: DriverType["status"];

	x: number;
	y: number;
	z: number;
};
