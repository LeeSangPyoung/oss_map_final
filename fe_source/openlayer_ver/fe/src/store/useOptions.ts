import { create } from 'zustand';

interface State {
  mode: 'online' | 'offline';
  setOptions: (option: any) => void;
}

export const useOptions = create<State>(set => ({
  mode: 'offline',
  setOptions: option =>
    set(state => ({
      mode: option.mode,
    })),
}));
