/* eslint-disable @typescript-eslint/naming-convention */
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { centerPointOL } from './utils/common.ts';
import EventEmitter from 'events';

interface Options {
  selector: string;
  mode: 'online' | 'offline';
  // mapOptions?: MapBase['mapOptions'];
}

export const MyEvents = new EventEmitter();

class SKCCMap {
  private myRootEl: HTMLDivElement | null;
  private root: ReturnType<typeof createRoot> | null = null;
  constructor() {
    this.myRootEl = null;
    this.root = null;
  }
  public init(options: Options) {
    const { createMap } = window.mapbaseStore.getState();
    const selector = document.getElementById(options.selector) as HTMLDivElement;
    if (selector) {
      this.myRootEl = selector;
    }
    if (this.myRootEl) {
      if (!this.root) {
        this.root = createRoot(this.myRootEl!);
      }
      this.root.render(<App mode={options.mode} />);
    }
    createMap('map-open-layer', {
      center: centerPointOL,
      zoom: 13,
    });
  }
}

// @ts-ignore
window.skccMap = SKCCMap;

if (process.env.NODE_ENV === 'development') {
  const skccMap = new SKCCMap();
  skccMap.init({
    selector: 'skcc-root',
    mode: 'offline',
  });
}
