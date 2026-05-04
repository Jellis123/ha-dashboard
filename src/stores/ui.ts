import { create } from "zustand";

interface UIStore {
  activeRoom: string | null;
  openRoom: (roomId: string) => void;
  closeRoom: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  activeRoom: null,
  openRoom: (roomId) => set({ activeRoom: roomId }),
  closeRoom: () => set({ activeRoom: null }),
}));
