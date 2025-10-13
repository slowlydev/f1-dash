import { create } from "zustand";

export type SortingCriteria = 
  | "position"           // Default race position
  | "bestLap"           // Best lap time
  | "lastLap"           // Last lap time
  | "pitStatus"         // In pit/pit out status
  | "positionChange"    // Positions gained/lost
  | "sector1"           // Best sector 1 time
  | "sector2"           // Best sector 2 time
  | "sector3"           // Best sector 3 time
  | "tyreAge";          // Tyre age

export type SortDirection = "asc" | "desc";

interface SortingState {
  criteria: SortingCriteria;
  direction: SortDirection;
  showSortOptions: boolean;
  setCriteria: (criteria: SortingCriteria) => void;
  toggleDirection: () => void;
  toggleSortOptions: () => void;
  setSort: (criteria: SortingCriteria) => void; // Set criteria and toggle direction if same criteria
}

export const useSortingStore = create<SortingState>((set) => ({
  criteria: "position",
  direction: "asc",
  showSortOptions: false,
  setCriteria: (criteria) => set({ criteria }),
  toggleDirection: () => set((state) => ({ 
    direction: state.direction === "asc" ? "desc" : "asc" 
  })),
  toggleSortOptions: () => set((state) => ({ 
    showSortOptions: !state.showSortOptions 
  })),
  setSort: (criteria) => set((state) => {
    // If clicking the same criteria, toggle direction
    if (state.criteria === criteria) {
      return { direction: state.direction === "asc" ? "desc" : "asc" };
    }
    // Otherwise, change criteria and set direction to ascending
    return { criteria, direction: "asc" };
  }),
})); 