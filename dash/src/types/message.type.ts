import { type Update, type State } from "./state.type";

export type Message = InitialMessage | UpdateMessage;

export type InitialMessage = {
	initial: State;
	history: History;
};

export type UpdateMessage = {
	update: Update; // note this is very partial
};

// TODO add all delayed stuff, but thats for later
