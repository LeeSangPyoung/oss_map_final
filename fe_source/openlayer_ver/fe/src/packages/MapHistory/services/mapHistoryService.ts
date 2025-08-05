import { Map } from 'ol';
import { MapHistoryState, MapViewState, UseMapHistoryOptions } from '../types';
import { captureMapState, restoreMapState, isStateEqual, limitHistorySize } from '../utils/historyUtils';

export class MapHistoryService {
  private map: Map;
  private state: MapHistoryState;
  private options: Required<UseMapHistoryOptions>;
  private autoSaveInterval?: number;

  constructor(map: Map, options: UseMapHistoryOptions = {}) {
    this.map = map;
    this.options = {
      maxHistorySize: options.maxHistorySize || 50,
      enableAutoSave: options.enableAutoSave || false,
      autoSaveInterval: options.autoSaveInterval || 5000,
    };

    // 초기 상태 설정
    const initialState = captureMapState(map);
    this.state = {
      past: [],
      present: initialState,
      future: [],
    };

    // 자동 저장 설정
    if (this.options.enableAutoSave) {
      this.startAutoSave();
    }
  }

  private startAutoSave(): void {
    this.autoSaveInterval = setInterval(() => {
      this.saveCurrentState();
    }, this.options.autoSaveInterval);
  }

  private stopAutoSave(): void {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = undefined;
    }
  }

  public saveCurrentState(): void {
    const currentState = captureMapState(this.map);
    
    // 현재 상태와 동일한지 확인
    if (isStateEqual(currentState, this.state.present)) {
      return;
    }

    // 과거에 현재 상태 추가
    const newPast = [...this.state.past, this.state.present];
    this.state.past = limitHistorySize(newPast, this.options.maxHistorySize);
    
    // 현재 상태 업데이트
    this.state.present = currentState;
    
    // 미래 상태 초기화 (새로운 상태가 추가되었으므로)
    this.state.future = [];
  }

                public back(animationDuration: number = 0): boolean {
                if (this.state.past.length === 0) {
                  return false;
                }

                // 현재 상태를 미래에 추가
                this.state.future = [this.state.present, ...this.state.future];
                
                // 과거에서 가장 최근 상태를 현재로 이동
                const previousState = this.state.past[this.state.past.length - 1];
                this.state.present = previousState;
                this.state.past = this.state.past.slice(0, -1);

                // 지도 상태 복원 (애니메이션 옵션 포함)
                restoreMapState(this.map, previousState, animationDuration);
                
                return true;
              }

              public forward(animationDuration: number = 0): boolean {
                if (this.state.future.length === 0) {
                  return false;
                }

                // 현재 상태를 과거에 추가
                this.state.past = [...this.state.past, this.state.present];
                
                // 미래에서 가장 최근 상태를 현재로 이동
                const nextState = this.state.future[0];
                this.state.present = nextState;
                this.state.future = this.state.future.slice(1);

                // 지도 상태 복원 (애니메이션 옵션 포함)
                restoreMapState(this.map, nextState, animationDuration);
                
                return true;
              }

  public canGoBack(): boolean {
    return this.state.past.length > 0;
  }

  public canGoForward(): boolean {
    return this.state.future.length > 0;
  }

  public clearHistory(): void {
    const currentState = captureMapState(this.map);
    this.state = {
      past: [],
      present: currentState,
      future: [],
    };
  }

  public getHistoryInfo(): { pastCount: number; futureCount: number } {
    return {
      pastCount: this.state.past.length,
      futureCount: this.state.future.length,
    };
  }

  public getCurrentState(): MapViewState {
    return this.state.present;
  }

  public destroy(): void {
    this.stopAutoSave();
  }
} 