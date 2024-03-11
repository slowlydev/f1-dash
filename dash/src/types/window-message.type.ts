import { CarData, Position, State } from "./state.type";

export type WindowMessage = WindowMessageState | WindowMessageCarData | WindowMessagePosition;

type WindowMessageState = {
	updateType: "state";
	state: State;
};

type WindowMessageCarData = {
	updateType: "car-data";
	carData: CarData;
};

type WindowMessagePosition = {
	updateType: "position";
	position: Position;
};
