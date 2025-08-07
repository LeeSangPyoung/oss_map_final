// UserLayer 패키지 - useUserLayer Hook
// 담당 기능:
// - addUserLayer (사용자 레이어 추가)
// - initUserLayer (사용자 레이어 초기화)
// - deleteUserLayer (사용자 레이어 삭제)
// - entireAreaUserLayer (사용자 레이어 전체 영역)

import { useCallback } from 'react';
import { UserLayerService } from '../services/userLayerService';
import { useMapbase } from "../../../store/useMapbase";
import {
  AddUserLayerOptions,
  AddUserLayerResult,
  InitUserLayerOptions,
  InitUserLayerResult,
  DeleteUserLayerOptions,
  DeleteUserLayerResult,
  EntireAreaUserLayerOptions,
  EntireAreaUserLayerResult
} from '../types';

export const useUserLayer = () => {
  const { map } = useMapbase();

  const addUserLayer = useCallback(async (options: AddUserLayerOptions = {}): Promise<AddUserLayerResult> => {
    const userLayerService = new UserLayerService(map);
    return await userLayerService.addUserLayer(options);
  }, [map]);

  const initUserLayer = useCallback(async (options: InitUserLayerOptions = {}): Promise<InitUserLayerResult> => {
    const userLayerService = new UserLayerService(map);
    return await userLayerService.initUserLayer(options);
  }, [map]);

  const deleteUserLayer = useCallback(async (options: DeleteUserLayerOptions): Promise<DeleteUserLayerResult> => {
    const userLayerService = new UserLayerService(map);
    return await userLayerService.deleteUserLayer(options);
  }, [map]);

  const entireAreaUserLayer = useCallback(async (options: EntireAreaUserLayerOptions): Promise<EntireAreaUserLayerResult> => {
    const userLayerService = new UserLayerService(map);
    return await userLayerService.entireAreaUserLayer(options);
  }, [map]);

  return {
    addUserLayer,
    initUserLayer,
    deleteUserLayer,
    entireAreaUserLayer
  };
}; 