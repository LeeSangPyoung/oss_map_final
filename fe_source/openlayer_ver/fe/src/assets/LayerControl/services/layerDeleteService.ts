import { deleteFeatureViaWFS } from '~/assets/OpenLayer/services/getFeatures';
import { DeleteFeatureParams, DeleteFeatureResult, GeometryType } from '../types';

/**
 * 피처 타입별 삭제 함수들
 */
const deletePointFeature = async (params: DeleteFeatureParams): Promise<DeleteFeatureResult> => {
  try {
    const { feature, layerName } = params;
    const extractedLayerName = layerName || feature.id.split('.')[0];
    
    console.log('🗑️ Point 피처 삭제 시작:', {
      featureId: feature.id,
      layerName: extractedLayerName,
      geometryType: feature.geometry.type
    });

    const result = await deleteFeatureViaWFS(extractedLayerName, feature.id);
    
    console.log('✅ Point 피처 삭제 성공:', result);
    
    return {
      success: true,
      message: '포인트 피처가 성공적으로 삭제되었습니다.',
      deletedFeatureId: feature.id
    };
  } catch (error) {
    console.error('❌ Point 피처 삭제 실패:', error);
    return {
      success: false,
      message: '포인트 피처 삭제에 실패했습니다.',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

const deleteLineFeature = async (params: DeleteFeatureParams): Promise<DeleteFeatureResult> => {
  try {
    const { feature, layerName } = params;
    const extractedLayerName = layerName || feature.id.split('.')[0];
    
    console.log('🗑️ Line 피처 삭제 시작:', {
      featureId: feature.id,
      layerName: extractedLayerName,
      geometryType: feature.geometry.type
    });

    const result = await deleteFeatureViaWFS(extractedLayerName, feature.id);
    
    console.log('✅ Line 피처 삭제 성공:', result);
    
    return {
      success: true,
      message: '라인 피처가 성공적으로 삭제되었습니다.',
      deletedFeatureId: feature.id
    };
  } catch (error) {
    console.error('❌ Line 피처 삭제 실패:', error);
    return {
      success: false,
      message: '라인 피처 삭제에 실패했습니다.',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

const deleteMultiLineFeature = async (params: DeleteFeatureParams): Promise<DeleteFeatureResult> => {
  try {
    const { feature, layerName } = params;
    const extractedLayerName = layerName || feature.id.split('.')[0];
    
    console.log('🗑️ MultiLine 피처 삭제 시작:', {
      featureId: feature.id,
      layerName: extractedLayerName,
      geometryType: feature.geometry.type
    });

    const result = await deleteFeatureViaWFS(extractedLayerName, feature.id);
    
    console.log('✅ MultiLine 피처 삭제 성공:', result);
    
    return {
      success: true,
      message: '멀티라인 피처가 성공적으로 삭제되었습니다.',
      deletedFeatureId: feature.id
    };
  } catch (error) {
    console.error('❌ MultiLine 피처 삭제 실패:', error);
    return {
      success: false,
      message: '멀티라인 피처 삭제에 실패했습니다.',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

const deletePolygonFeature = async (params: DeleteFeatureParams): Promise<DeleteFeatureResult> => {
  try {
    const { feature, layerName } = params;
    const extractedLayerName = layerName || feature.id.split('.')[0];
    
    console.log('🗑️ Polygon 피처 삭제 시작:', {
      featureId: feature.id,
      layerName: extractedLayerName,
      geometryType: feature.geometry.type
    });

    const result = await deleteFeatureViaWFS(extractedLayerName, feature.id);
    
    console.log('✅ Polygon 피처 삭제 성공:', result);
    
    return {
      success: true,
      message: '폴리곤 피처가 성공적으로 삭제되었습니다.',
      deletedFeatureId: feature.id
    };
  } catch (error) {
    console.error('❌ Polygon 피처 삭제 실패:', error);
    return {
      success: false,
      message: '폴리곤 피처 삭제에 실패했습니다.',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * 메인 삭제 서비스 함수
 */
export const deleteFeatureService = async (params: DeleteFeatureParams): Promise<DeleteFeatureResult> => {
  const { feature } = params;
  const geometryType = feature.geometry.type as GeometryType;

  console.log('🗑️ 피처 삭제 서비스 시작:', {
    featureId: feature.id,
    geometryType,
    hasGeometry: !!feature.geometry
  });

  // 피처 유효성 검사
  if (!feature.id) {
    return {
      success: false,
      message: '피처 ID가 없습니다.',
      error: 'Feature ID is missing'
    };
  }

  if (!feature.geometry || !feature.geometry.type) {
    return {
      success: false,
      message: '피처 지오메트리가 없습니다.',
      error: 'Feature geometry is missing'
    };
  }

  // 지오메트리 타입별 삭제 처리
  switch (geometryType) {
    case 'Point':
      return await deletePointFeature(params);
    
    case 'LineString':
      return await deleteLineFeature(params);
    
    case 'MultiLineString':
      return await deleteMultiLineFeature(params);
    
    case 'Polygon':
      return await deletePolygonFeature(params);
    
    default:
      return {
        success: false,
        message: `지원하지 않는 피처 타입입니다: ${geometryType}`,
        error: `Unsupported geometry type: ${geometryType}`
      };
  }
};
