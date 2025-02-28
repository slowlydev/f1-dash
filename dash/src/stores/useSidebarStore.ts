import { persist, createJSONStorage, subscribeWithSelector } from "zustand/middleware";
import { create } from "zustand";

type SidebarStore = {
	visiable: boolean;

	setVisiable: (visiable: boolean) => void;
	open: () => void;
	close: () => void;
	toggle: () => void;
};

export const useSidebarStore = create(
	persist<SidebarStore>(
		(set) => ({
			visiable: true,
			setVisiable: (visiable) => set({ visiable }),
			open: () => set({ visiable: true }),
			close: () => set({ visiable: false }),
			toggle: () => set((state) => ({ visiable: !state.visiable })),
		}),
		{
			name: "sidebar-storage",
			storage: createJSONStorage(() => localStorage),
		},
	),
);
