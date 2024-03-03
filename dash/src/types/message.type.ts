import { type State } from "./state.type";

export type Message = InitialMessage | UpdateMessage;

export type InitialMessage = {
	initial: State;
};

export type UpdateMessage = {
	update: State; // note this is very partial
};

// TODO add all delayed stuff, but thats for later
