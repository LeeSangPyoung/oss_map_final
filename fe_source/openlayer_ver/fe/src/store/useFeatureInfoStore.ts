import { create } from 'zustand';

interface State {
  featureInfo: any;
  setFeatureInfo: (info: any) => void;
}

export const useFeatureInfoStore = create<State>(set => ({
  featureInfo: undefined,
  setFeatureInfo: info => set({ featureInfo: info }),
}));
