import { create } from "zustand";

type Tab = "tab1" | "tab2";

interface JourneyState {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export const useJourneyStore = create<JourneyState>((set) => ({
  activeTab: "tab1", // дефолтный таб
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
