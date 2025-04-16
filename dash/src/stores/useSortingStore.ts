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

interface SortingState {
  criteria: SortingCriteria;
  setCriteria: (criteria: SortingCriteria) => void;
}

export const useSortingStore = create<SortingState>((set) => ({
  criteria: "position",
  setCriteria: (criteria) => set({ criteria }),
})); 