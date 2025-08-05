// LayerControl 패키지 메인 export
export { useLayerDelete, deleteSelectedFeature } from './hooks/useLayerDelete';
export { deleteFeatureService } from './services/layerDeleteService';
export type { 
  FeatureBase, 
  DeleteFeatureParams, 
  DeleteFeatureResult, 
  GeometryType 
} from './types';
