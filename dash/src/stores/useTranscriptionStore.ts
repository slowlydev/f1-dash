import { persist, createJSONStorage, subscribeWithSelector } from "zustand/middleware";
import { create } from "zustand";

type Models = {
	value: Model;
	label: string;
}[]

export const models: Models = [
	{
		value: "Xenova/whisper-tiny",
		label: "Low Latency",
	},
	{
		value: "Xenova/whisper-base",
		label: "Balanced",
	},
	{
		value: "distil-whisper/distil-small.en",
		label: "High Quality",
	},
]

type Model = "distil-whisper/distil-small.en" | "Xenova/whisper-base" | "Xenova/whisper-tiny";

type TranscriptionStore = {
	enabled: boolean;
	setEnabled: (enabled: boolean) => void;

	model: Model;
	setModel: (model: Model) => void;
};

export const useTranscriptionStore = create(
	subscribeWithSelector(
		persist<TranscriptionStore>(
			(set) => ({
				enabled: false,
				setEnabled: (enabled) => set(() => ({ enabled })),
				
				model: "Xenova/whisper-tiny",
				setModel: (model) => set(() => ({ model })),
			}),
			{
				name: "transcription-storage",
				storage: createJSONStorage(() => localStorage),
			},
		),
	),
);
