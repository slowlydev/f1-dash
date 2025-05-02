import { create } from "zustand";

type SidebarStore = {
	pinned: boolean;
	opened: boolean;

	close: () => void;
	open: () => void;

	pin: () => void;
	unpin: () => void;
};

export const useSidebarStore = create<SidebarStore>()((set) => ({
	pinned: true,
	opened: false,

	close: () => {
		set({ opened: false });
	},
	open: () => {
		set({ opened: true });
	},

	pin: () => {
		set({ pinned: true, opened: false });
	},
	unpin: () => {
		set({ pinned: false, opened: false });
	},
}));
