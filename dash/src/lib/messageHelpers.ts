import { UpdateMessage, InitialMessage, Message } from "@/types/message.type";

export const messageIsUpdate = (message: Message): message is UpdateMessage => {
	return "update" in message;
};

export const messageIsInitial = (message: Message): message is InitialMessage => {
	return "initial" in message;
};
