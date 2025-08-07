import { updateFeatureViaWFS, insertFeatureViaWFS, deleteFeatureViaWFS } from '~/assets/OpenLayer/services/getFeatures';

/**
 * 피처 업데이트 서비스
 */
export const updateFeature = async (featureData: any, layerName: string) => {
  try {
    console.log('Updating feature:', featureData);
    const result = await updateFeatureViaWFS(featureData, layerName);
    console.log('Feature updated successfully:', result);
    return result;
  } catch (error) {
    console.error('Error updating feature:', error);
    throw error;
  }
};

/**
 * 피처 삽입 서비스
 */
export const insertFeature = async (featureData: any, layerName: string) => {
  try {
    console.log('Inserting feature:', featureData);
    const result = await insertFeatureViaWFS(featureData, layerName);
    console.log('Feature inserted successfully:', result);
    return result;
  } catch (error) {
    console.error('Error inserting feature:', error);
    throw error;
  }
};

/**
 * 피처 삭제 서비스
 */
export const deleteFeature = async (featureId: string, layerName: string) => {
  try {
    console.log('Deleting feature:', featureId);
    const result = await deleteFeatureViaWFS(featureId, layerName);
    console.log('Feature deleted successfully:', result);
    return result;
  } catch (error) {
    console.error('Error deleting feature:', error);
    throw error;
  }
};

/**
 * 피처 조회 서비스
 */
export const getFeatures = async (layerName: string, bbox?: number[]) => {
  try {
    console.log('Getting features for layer:', layerName);
    // WFS GetFeature 요청 구현
    const url = `${process.env.REACT_APP_GEOSERVER_URL}/geoserver/wfs`;
    const params = new URLSearchParams({
      service: 'WFS',
      version: '1.0.0',
      request: 'GetFeature',
      typeName: layerName,
      outputFormat: 'application/json',
      ...(bbox && { bbox: bbox.join(',') })
    });

    const response = await fetch(`${url}?${params}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Features retrieved successfully:', data);
    return data;
  } catch (error) {
    console.error('Error getting features:', error);
    throw error;
  }
};

/**
 * 레이어 정보 조회 서비스
 */
export const getLayerInfo = async (layerName: string) => {
  try {
    console.log('Getting layer info for:', layerName);
    // WFS DescribeFeatureType 요청 구현
    const url = `${process.env.REACT_APP_GEOSERVER_URL}/geoserver/wfs`;
    const params = new URLSearchParams({
      service: 'WFS',
      version: '1.0.0',
      request: 'DescribeFeatureType',
      typeName: layerName
    });

    const response = await fetch(`${url}?${params}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.text();
    console.log('Layer info retrieved successfully:', data);
    return data;
  } catch (error) {
    console.error('Error getting layer info:', error);
    throw error;
  }
};

/**
 * 레이어 목록 조회 서비스
 */
export const getLayerList = async () => {
  try {
    console.log('Getting layer list');
    // WFS GetCapabilities 요청 구현
    const url = `${process.env.REACT_APP_GEOSERVER_URL}/geoserver/wfs`;
    const params = new URLSearchParams({
      service: 'WFS',
      version: '1.0.0',
      request: 'GetCapabilities'
    });

    const response = await fetch(`${url}?${params}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.text();
    console.log('Layer list retrieved successfully:', data);
    return data;
  } catch (error) {
    console.error('Error getting layer list:', error);
    throw error;
  }
};

/**
 * 피처 검증 서비스
 */
export const validateFeature = (featureData: any): boolean => {
  try {
    if (!featureData || !featureData.geometry || !featureData.properties) {
      console.error('Invalid feature data structure');
      return false;
    }

    const { geometry, properties } = featureData;
    
    if (!geometry.type || !geometry.coordinates) {
      console.error('Invalid geometry structure');
      return false;
    }

    if (!Array.isArray(geometry.coordinates)) {
      console.error('Invalid coordinates format');
      return false;
    }

    console.log('Feature validation passed');
    return true;
  } catch (error) {
    console.error('Error validating feature:', error);
    return false;
  }
};

/**
 * 피처 데이터 변환 서비스
 */
export const transformFeatureData = (featureData: any, targetFormat: string = 'geojson') => {
  try {
    switch (targetFormat.toLowerCase()) {
      case 'geojson':
        return {
          type: 'Feature',
          geometry: featureData.geometry,
          properties: featureData.properties
        };
      case 'wfs':
        // WFS 형식으로 변환
        return {
          ...featureData,
          // WFS 특정 필드 추가
        };
      default:
        console.warn('Unknown target format:', targetFormat);
        return featureData;
    }
  } catch (error) {
    console.error('Error transforming feature data:', error);
    return featureData;
  }
}; 