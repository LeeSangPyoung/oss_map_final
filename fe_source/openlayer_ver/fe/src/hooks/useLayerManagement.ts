import { useCallback } from 'react';
import { Map } from 'ol';

interface UseLayerManagementProps {
  map: Map | null;
  layerData: any[];
  checkedLayers: string[];
  setCheckedLayers: (layers: string[]) => void;
}

export const useLayerManagement = ({ 
  map, 
  layerData, 
  checkedLayers, 
  setCheckedLayers 
}: UseLayerManagementProps) => {
  
  const handleGetLayer = useCallback(() => {
    if (!map) return;
    const layers = map.getLayers().getArray();
    console.log('Map layers:', layers);
  }, [map]);

  const handleGetExternalLayerName = useCallback(() => {
    if (!map) return;
    const layers = map.getLayers().getArray();
    const externalLayers = layers.filter(layer => layer.get('type') === 'external');
    console.log('External layer names:', externalLayers.map(layer => layer.get('name')));
  }, [map]);

  const handleGetTableNameOfLayer = useCallback(() => {
    if (!map) return;
    const layers = map.getLayers().getArray();
    layers.forEach(layer => {
      const name = layer.get('name');
      const tableName = layer.get('tableName');
      console.log(`Layer: ${name}, Table: ${tableName}`);
    });
  }, [map]);

  const handleGetMinDisplayZoomLevel = useCallback(() => {
    if (!map) return;
    const layers = map.getLayers().getArray();
    layers.forEach(layer => {
      const name = layer.get('name');
      const minZoom = layer.get('minZoom');
      console.log(`Layer: ${name}, Min Zoom: ${minZoom}`);
    });
  }, [map]);

  const handleGetMaxDisplayZoomLevel = useCallback(() => {
    if (!map) return;
    const layers = map.getLayers().getArray();
    layers.forEach(layer => {
      const name = layer.get('name');
      const maxZoom = layer.get('maxZoom');
      console.log(`Layer: ${name}, Max Zoom: ${maxZoom}`);
    });
  }, [map]);

  const handleLayerCheckboxChange = useCallback((checkedValues: any) => {
    if (!map) return;
    
    const layers = map.getLayers().getArray();
    
    // 모든 레이어를 숨김 (기본 지도 레이어 제외)
    layers.forEach(layer => {
      const layerName = layer.get('name');
      const layerType = layer.get('type');
      // 기본 지도 레이어(OSM)는 항상 보이도록 유지
      if (layerType !== 'base' && layerName !== 'osm') {
        layer.setVisible(false);
      }
    });
    
    // 체크된 레이어만 보임
    checkedValues.forEach((layerName: string) => {
      const layer = layers.find(l => l.get('name') === layerName);
      if (layer) {
        layer.setVisible(true);
      }
    });
    
    setCheckedLayers(checkedValues);
  }, [map, setCheckedLayers]);

  const handleShowAllLayers = useCallback(() => {
    if (!map) return;
    
    const layers = map.getLayers().getArray();
    const allLayerNames: string[] = [];
    
    layers.forEach(layer => {
      layer.setVisible(true);
      const name = layer.get('name');
      if (name) {
        allLayerNames.push(name);
      }
    });
    
    setCheckedLayers(allLayerNames);
  }, [map, setCheckedLayers]);

  const handleHideAllLayers = useCallback(() => {
    if (!map) return;
    
    const layers = map.getLayers().getArray();
    
    layers.forEach(layer => {
      const layerName = layer.get('name');
      const layerType = layer.get('type');
      // 기본 지도 레이어(OSM)는 항상 보이도록 유지
      if (layerType !== 'base' && layerName !== 'osm') {
        layer.setVisible(false);
      }
    });
    
    setCheckedLayers([]);
  }, [map, setCheckedLayers]);

  const handleRunSetLayerDisplayLevelCode = useCallback(async () => {
    if (!map) return;
    
    const layers = map.getLayers().getArray();
    const layerName = 'your_layer_name'; // 실제 레이어 이름으로 변경 필요
    const minZoom = 10;
    const maxZoom = 20;
    
    const targetLayer = layers.find(layer => layer.get('name') === layerName);
    if (targetLayer) {
      targetLayer.set('minZoom', minZoom);
      targetLayer.set('maxZoom', maxZoom);
      console.log(`Set display level for ${layerName}: min=${minZoom}, max=${maxZoom}`);
    }
  }, [map]);

  const handleRunSetLayerStyleCode = useCallback(async () => {
    if (!map) return;
    
    const layers = map.getLayers().getArray();
    const layerName = 'your_layer_name'; // 실제 레이어 이름으로 변경 필요
    
    const targetLayer = layers.find(layer => layer.get('name') === layerName);
    if (targetLayer) {
      // 스타일 설정 로직 (구현 필요)
      console.log(`Set style for ${layerName}`);
    }
  }, [map]);

  const handleRunSetLayerStyleDefaultCode = useCallback(async () => {
    if (!map) return;
    
    const layers = map.getLayers().getArray();
    const layerName = 'your_layer_name'; // 실제 레이어 이름으로 변경 필요
    
    const targetLayer = layers.find(layer => layer.get('name') === layerName);
    if (targetLayer) {
      // 기본 스타일 설정 로직 (구현 필요)
      console.log(`Set default style for ${layerName}`);
    }
  }, [map]);

  return {
    handleGetLayer,
    handleGetExternalLayerName,
    handleGetTableNameOfLayer,
    handleGetMinDisplayZoomLevel,
    handleGetMaxDisplayZoomLevel,
    handleLayerCheckboxChange,
    handleShowAllLayers,
    handleHideAllLayers,
    handleRunSetLayerDisplayLevelCode,
    handleRunSetLayerStyleCode,
    handleRunSetLayerStyleDefaultCode,
  };
}; 