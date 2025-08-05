import { create } from 'zustand';
import { fromLonLat, toLonLat } from 'ol/proj';
import { isEqual } from 'lodash';
import { useMapbase } from './useMapbase';
interface History {
  stack: {
    center: number[];
    zoom: number;
  }[];
  idx: number;
}

interface MapHistoryState {
  history: History;
  addHistory: boolean;
  setAddHistory: (value: boolean) => void;
  onMoveEnd: () => void;
  back: () => void;
  forward: () => void;
  isBack: () => boolean;
  isForward: () => boolean;
  resetHistory?: () => void;
}

const MANAGE_CNT = 10; // Giới hạn số lượng lịch sử

export const useMapHistoryStore = create<MapHistoryState>((set, get) => ({
  history: { stack: [], idx: -1 },
  addHistory: true,

  setAddHistory: value => set({ addHistory: value }),
  resetHistory: () => {
    set({ history: { stack: [], idx: -1 }, addHistory: true });
  },

  onMoveEnd: () => {
    const { addHistory, history, setAddHistory } = get();
    const map = useMapbase.getState().map;
    const view = map?.getView();

    if (!view || !view.getCenter()) {
      return;
    }

    if (!addHistory) {
      console.log('add history false');
      setAddHistory(true);
      return;
    }

    const currentHistory = { ...history };
    if (history.idx !== -1 && history.idx !== currentHistory.stack.length - 1) {
      currentHistory.stack = currentHistory.stack.slice(0, currentHistory.idx + 1);
    }

    if (currentHistory.stack.length >= MANAGE_CNT) {
      currentHistory.stack.splice(0, 1);
      currentHistory.idx = currentHistory.stack.length - 1;
    }

    const historyStack = currentHistory.stack;
    if (
      historyStack.length > 1 &&
      historyStack[historyStack.length - 1].zoom === view?.getZoom() &&
      isEqual(historyStack[historyStack.length - 1].center, toLonLat(view.getCenter()!))
    ) {
      console.log('123456');
      return;
    }

    currentHistory.stack.push({
      center: toLonLat(view.getCenter()!),
      zoom: view.getZoom()!,
    });

    currentHistory.idx += 1;

    set({ history: currentHistory });
  },

  back: () => {
    const map = useMapbase.getState().map;

    const { history, setAddHistory } = get();
    if (history.idx === 0) {
      return;
    }

    const currentHistory = { ...history };
    currentHistory.idx -= 1;
    const item = currentHistory.stack[currentHistory.idx];

    setAddHistory(false);

    if (item) {
      map?.getView().animate({
        center: fromLonLat(item.center),
        zoom: item.zoom,
        duration: 1000
      });
    }

    set({ history: currentHistory });
  },

  forward: () => {
    const map = useMapbase.getState().map;

    const { history, setAddHistory } = get();
    if (history.idx >= history.stack.length - 1) {
      return;
    }

    const currentHistory = { ...history };
    currentHistory.idx += 1;
    const item = currentHistory.stack[currentHistory.idx];

    setAddHistory(false);

    if (item) {
      map?.getView().animate({
        center: fromLonLat(item.center),
        zoom: item.zoom,
        duration: 1000
      });
    }

    set({ history: currentHistory });
  },

  isBack: () => get().history.idx > 0,

  isForward: () => {
    const { history } = get();
    return history.idx < history.stack.length - 1;
  },
}));
