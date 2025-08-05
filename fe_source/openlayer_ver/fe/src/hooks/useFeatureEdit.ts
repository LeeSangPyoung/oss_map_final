import { useCallback } from 'react';
import { Map } from 'ol';
import TileLayer from 'ol/layer/Tile';
import ImageLayer from 'ol/layer/Image';
import { updateFeatureViaWFS, insertFeatureViaWFS, deleteFeatureViaWFS } from '../packages/OpenLayer/services/getFeatures';
import { useMapbase } from '../store/useMapbase';

interface UseFeatureEditProps {
  map: Map | null;
  setShowNodeTypeSelector: (show: boolean) => void;
  setShowLineTypeSelector: (show: boolean) => void;
  setShowPolygonTypeSelector: (show: boolean) => void;
  setNodeTypeSelectorPosition: (position: { x: number; y: number }) => void;
  setLineTypeSelectorPosition: (position: { x: number; y: number }) => void;
  setPolygonTypeSelectorPosition: (position: { x: number; y: number }) => void;
  setSelectedNodeType: (type: string) => void;
  setSelectedLineType: (type: string) => void;
  setSelectedPolygonType: (type: string) => void;
}

export const useFeatureEdit = ({
  map,
  setShowNodeTypeSelector,
  setShowLineTypeSelector,
  setShowPolygonTypeSelector,
  setNodeTypeSelectorPosition,
  setLineTypeSelectorPosition,
  setPolygonTypeSelectorPosition,
  setSelectedNodeType,
  setSelectedLineType,
  setSelectedPolygonType,
}: UseFeatureEditProps) => {

  const showNodeTypeSelectorPopup = useCallback((coordinate: number[], pixel: number[]) => {
    setNodeTypeSelectorPosition({ x: pixel[0], y: pixel[1] });
    setShowNodeTypeSelector(true);
  }, [setNodeTypeSelectorPosition, setShowNodeTypeSelector]);

  const showLineTypeSelectorPopup = useCallback((coordinate: number[], pixel: number[]) => {
    setLineTypeSelectorPosition({ x: pixel[0], y: pixel[1] });
    setShowLineTypeSelector(true);
  }, [setLineTypeSelectorPosition, setShowLineTypeSelector]);

  const showPolygonTypeSelectorPopup = useCallback((coordinate: number[], pixel: number[]) => {
    setPolygonTypeSelectorPosition({ x: pixel[0], y: pixel[1] });
    setShowPolygonTypeSelector(true);
  }, [setPolygonTypeSelectorPosition, setShowPolygonTypeSelector]);

  const saveDrawnLine = useCallback(async (lineType: string) => {
    if (!map) return;

    try {
      // drawnFeatureRef에서 그린 feature 가져오기
      const drawnFeature = (map as any).drawnFeatureRef?.current;
      if (!drawnFeature) {
        console.error('No drawn feature found');
        return;
      }

      const geometry = drawnFeature.getGeometry();
      if (!geometry) {
        console.error('No geometry found in drawn feature');
        return;
      }

      // EPSG:5179에서 EPSG:4326으로 좌표 변환
      const transform = map.getView().getProjection().getCode() === 'EPSG:5179' ? 
        async (coord: number[]) => {
          const { transform } = await import('ol/proj');
          return transform(coord, 'EPSG:5179', 'EPSG:4326');
        } : 
        (coord: number[]) => coord;
      
      const coordinates = geometry.getCoordinates();
      const transformedCoordinates = await Promise.all(
        coordinates.map((coord: number[]) => transform(coord))
      );
      
      const geometryData = {
        type: 'LineString',
        coordinates: transformedCoordinates
      };
      
      const properties = {
        type: lineType,
        property: `새로운 ${lineType} ${new Date().toLocaleString()}`
      };
      
      console.log('Saving line feature:', { geometry: geometryData, properties });
      
      // WFS를 통한 저장
      const result = await insertFeatureViaWFS(lineType, geometryData, properties);
      
      // 성공 여부 확인
      const resultStr = String(result);
      if (resultStr.includes('SUCCESS') || resultStr.includes('totalInserted="1"') || resultStr.includes('<wfs:totalInserted>1</wfs:totalInserted>') || resultStr.includes('FeatureId')) {
        alert('라인이 성공적으로 저장되었습니다!');
        
        // 레이어 새로고침
        const layers = map.getLayers().getArray() || [];
        layers.forEach(layer => {
          if (layer instanceof TileLayer || layer instanceof ImageLayer) {
            const source = layer.getSource();
            if (source && source.refresh) {
              console.log('WMS/Tile 레이어 새로고침:', layer.get('layerName') || 'unnamed');
              source.refresh();
            }
          }
        });
        
        // 지도 렌더링
        map.render();
        
        // 모드 초기화 제거 (Advanced Trail Draw Line과 동일하게 모드 유지)
      } else {
        alert('저장에 실패했습니다. 다시 시도해주세요.');
      }
      
    } catch (error: any) {
      console.error('라인 저장 중 오류:', error);
      alert(`저장 중 오류가 발생했습니다: ${error.message}`);
    }
  }, [map]);

  const saveDrawnPolygon = useCallback(async (polygonType: string) => {
    if (!map) return;

    try {
      // drawnFeatureRef에서 그린 feature 가져오기
      const drawnFeature = (map as any).drawnFeatureRef?.current;
      if (!drawnFeature) {
        console.error('No drawn feature found');
        return;
      }

      const geometry = drawnFeature.getGeometry();
      if (!geometry) {
        console.error('No geometry found in drawn feature');
        return;
      }

      // EPSG:5179에서 EPSG:4326으로 좌표 변환
      const transform = map.getView().getProjection().getCode() === 'EPSG:5179' ? 
        async (coord: number[]) => {
          const { transform } = await import('ol/proj');
          return transform(coord, 'EPSG:5179', 'EPSG:4326');
        } : 
        (coord: number[]) => coord;
      
      const coordinates = geometry.getCoordinates();
      const transformedCoordinates = await Promise.all(
        coordinates.map((coord: number[]) => transform(coord))
      );
      
      const geometryData = {
        type: 'Polygon',
        coordinates: transformedCoordinates
      };
      
      const properties = {
        type: polygonType,
        property: `새로운 ${polygonType} ${new Date().toLocaleString()}`
      };
      
      console.log('Saving polygon feature:', { geometry: geometryData, properties });
      
      // WFS를 통한 저장
      const result = await insertFeatureViaWFS(polygonType, geometryData, properties);
      
      // 성공 여부 확인
      const resultStr = String(result);
      if (resultStr.includes('SUCCESS') || resultStr.includes('totalInserted="1"') || resultStr.includes('<wfs:totalInserted>1</wfs:totalInserted>') || resultStr.includes('FeatureId')) {
        alert('폴리곤이 성공적으로 저장되었습니다!');
        
        // 레이어 새로고침
        const layers = map.getLayers().getArray() || [];
        layers.forEach(layer => {
          if (layer instanceof TileLayer || layer instanceof ImageLayer) {
            const source = layer.getSource();
            if (source && source.refresh) {
              console.log('WMS/Tile 레이어 새로고침:', layer.get('layerName') || 'unnamed');
              source.refresh();
            }
          }
        });
        
        // 지도 렌더링
        map.render();
        
        // 모드 초기화 제거 (Advanced Trail Draw Line과 동일하게 모드 유지)
      } else {
        alert('저장에 실패했습니다. 다시 시도해주세요.');
      }
      
    } catch (error: any) {
      console.error('폴리곤 저장 중 오류:', error);
      alert(`저장 중 오류가 발생했습니다: ${error.message}`);
    }
  }, [map]);

  const saveDrawnPoint = useCallback(async (nodeType: string) => {
    if (!map) return;

    try {
      // 그린 포인트 좌표 가져오기 (drawnFeatureRef에서)
      const drawnFeature = (map as any).drawnFeatureRef?.current;
      if (!drawnFeature) {
        console.error('No drawn feature found');
        return;
      }

      const geometry = drawnFeature.getGeometry();
      if (!geometry) {
        console.error('No geometry found in drawn feature');
        return;
      }

      // EPSG:5179에서 EPSG:4326으로 좌표 변환
      const transform = map.getView().getProjection().getCode() === 'EPSG:5179' ? 
        async (coord: number[]) => {
          const { transform } = await import('ol/proj');
          return transform(coord, 'EPSG:5179', 'EPSG:4326');
        } : 
        (coord: number[]) => coord;
      
      const coordinates = geometry.getCoordinates();
      const transformedCoordinate = await transform(coordinates);
      
      const geometryData = {
        type: 'Point',
        coordinates: transformedCoordinate
      };
      
      const properties = {
        type: nodeType,
        property: `새로운 ${nodeType} ${new Date().toLocaleString()}`
      };
      
      console.log('Saving point feature:', { geometry: geometryData, properties });
      
      // WFS를 통한 저장
      const result = await insertFeatureViaWFS(nodeType, geometryData, properties);
      
      // 성공 여부 확인
      const resultStr = String(result);
      if (resultStr.includes('SUCCESS') || resultStr.includes('totalInserted="1"') || resultStr.includes('<wfs:totalInserted>1</wfs:totalInserted>') || resultStr.includes('FeatureId')) {
        alert('포인트가 성공적으로 저장되었습니다!');
        
        // 레이어 새로고침
        const layers = map.getLayers().getArray() || [];
        layers.forEach(layer => {
          if (layer instanceof TileLayer || layer instanceof ImageLayer) {
            const source = layer.getSource();
            if (source && source.refresh) {
              console.log('WMS/Tile 레이어 새로고침:', layer.get('layerName') || 'unnamed');
              source.refresh();
            }
          }
        });
        
        // 지도 렌더링
        map.render();
        
        // 모드 초기화 제거 (Advanced Trail Draw Line과 동일하게 모드 유지)
      } else {
        alert('저장에 실패했습니다. 다시 시도해주세요.');
      }
      
    } catch (error: any) {
      console.error('포인트 저장 중 오류:', error);
      alert(`저장 중 오류가 발생했습니다: ${error.message}`);
    }
  }, [map]);

  const handleNodeTypeSelect = useCallback((nodeType: string) => {
    setSelectedNodeType(nodeType);
    setShowNodeTypeSelector(false);
    saveDrawnPoint(nodeType);
  }, [setSelectedNodeType, setShowNodeTypeSelector, saveDrawnPoint]);

  const handleLineTypeSelect = useCallback((lineType: string) => {
    setSelectedLineType(lineType);
    setShowLineTypeSelector(false);
    saveDrawnLine(lineType);
  }, [setSelectedLineType, setShowLineTypeSelector, saveDrawnLine]);

  const handlePolygonTypeSelect = useCallback((polygonType: string) => {
    setSelectedPolygonType(polygonType);
    setShowPolygonTypeSelector(false);
    saveDrawnPolygon(polygonType);
  }, [setSelectedPolygonType, setShowPolygonTypeSelector, saveDrawnPolygon]);

  const handleSaveClick = useCallback(() => {
    // 저장 버튼 클릭 처리
    console.log('Save button clicked');
  }, []);

  const handleLineSaveClick = useCallback(() => {
    // 라인 저장 버튼 클릭 처리
    console.log('Line save button clicked');
  }, []);

  const handlePolygonSaveClick = useCallback(() => {
    // 폴리곤 저장 버튼 클릭 처리
    console.log('Polygon save button clicked');
  }, []);

  return {
    showNodeTypeSelectorPopup,
    showLineTypeSelectorPopup,
    showPolygonTypeSelectorPopup,
    saveDrawnLine,
    saveDrawnPolygon,
    saveDrawnPoint,
    handleNodeTypeSelect,
    handleLineTypeSelect,
    handlePolygonTypeSelect,
    handleSaveClick,
    handleLineSaveClick,
    handlePolygonSaveClick,
  };
}; 