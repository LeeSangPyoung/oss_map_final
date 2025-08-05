import mapboxgl, { Map, LngLatBoundsLike } from 'mapbox-gl';
import { GeoJSON } from 'geojson';
import { LayerModel, LayerStyle } from '~/models/Layer';

const addLayerClickHandler = (mapRef: Map | null, layerName: string) => {
  if (mapRef?.getLayer(layerName)) {
    mapRef?.on('click', layerName, e => {
      const layerInfo = e.features?.[0].layer;
      const featureInfo = e.features?.[0].geometry;

      alert(`
        type: ${layerInfo?.type},
        geometry: {
          type: ${featureInfo?.type},
          coordinates: ${JSON.stringify(featureInfo?.coordinates)},
          style: ${JSON.stringify(layerInfo?.paint)}
        }
      `);
    });
  }
};

// pass mapRef.current
export const getCenter = (mapRef: Map | null) => {
  if (mapRef) {
    const data = mapRef.getCenter();
    const lat = data.lat.toFixed(14);
    const lng = data.lng.toFixed(14);
    alert(`Center point: lat: ${lat}, long: ${lng}`);
  }
};

export const getZoom = (mapRef: Map | null) => {
  if (mapRef) {
    const zoom = mapRef.getZoom();
    alert(`Zoom: ${zoom}`);
  }
};

export const getMinZoom = (mapRef: Map | null) => {
  if (mapRef) {
    const minZoom = mapRef.getMinZoom();
    alert(` minZoom: ${minZoom}`);
  }
};

export const getMaxZoom = (mapRef: Map | null) => {
  if (mapRef) {
    const maxZoom = mapRef.getMaxZoom();
    alert(`maxZoom: ${maxZoom}`);
  }
};

export const panToView = (mapRef: Map | null) => {
  mapRef?.panTo([127.0235, 37.68216], {
    animate: true,
    duration: 300,
    linear: true,
  });
};

export const fitBoundsView = (mapRef: Map | null) => {
  const bounds: LngLatBoundsLike = [
    [126.9, 37.4],
    [127.15, 37.6],
  ];
  return mapRef?.fitBounds(bounds, {
    padding: { top: 10, bottom: 25, left: 15, right: 5 },
    maxZoom: 13,
    linear: true,
  });
};

export const setView = (mapRef: Map | null) => {
  mapRef?.flyTo({ center: [126.76202, 37.68216] });
};

export const setZoom = (mapRef: Map | null) => {
  mapRef?.setZoom(10);
};

export const zoomOut = (mapRef: Map | null) => {
  mapRef?.zoomOut({ offset: [80, 60] });
};

export const zoomIn = (mapRef: Map | null) => {
  mapRef?.zoomIn({ duration: 1000 });
};

export const setUserFeatureLayerStyle = (mapRef: Map | null) => {
  const fillLayer = mapRef?.getLayer('polygonFillLayer');
  const lineLayer = mapRef?.getLayer('polygonLineLayer');

  if (fillLayer && lineLayer) {
    mapRef?.setPaintProperty('polygonFillLayer', 'fill-color', '#FFE400');
    mapRef?.setPaintProperty('polygonFillLayer', 'fill-opacity', 0.8);
    mapRef?.setPaintProperty('polygonLineLayer', 'line-color', '#000000');
    mapRef?.setPaintProperty('polygonLineLayer', 'line-opacity', 1);
    mapRef?.setPaintProperty('polygonLineLayer', 'line-width', 5);
    mapRef?.setPaintProperty('polygonLineLayer', 'line-dasharray', [10, 10]);
  }
};

export const setLayerStyle = (mapRef: Map | null, layer: string, layerStyle: LayerStyle) => {
  if (!mapRef?.getLayer(layer)) {
    return;
  }
  const parsedLayout = JSON.parse(layerStyle.layout);
  Object.entries(parsedLayout).forEach(([property, value]) => {
    mapRef.setPaintProperty(layer, property, value);
  });
};

export const resetLayerStyle = (mapRef: Map | null, layerName: string, layerStyleList: LayerStyle[]) => {
  if (!mapRef?.getLayer(layerName)) {
    return;
  }
  const defaultLayerStyle = layerStyleList.find(style => style.styleName === layerName)?.layout;
  const parsedLayout = JSON.parse(defaultLayerStyle);
  Object.entries(parsedLayout).forEach(([property, value]) => {
    mapRef?.setPaintProperty(layerName, property, value);
  });
};

export const addData = (mapRef: Map | null) => {
  if (!mapRef?.getSource('polygon')) {
    const polygonData: GeoJSON = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [126.992289345605, 37.5887805938127],
            [126.882289345605, 37.3687805938127],
            [127.242289345605, 37.3687805938127],
            [126.992289345605, 37.5887805938127],
          ],
        ],
      },
    };
    mapRef?.addSource('polygon', {
      type: 'geojson',
      data: polygonData,
    });

    if (!mapRef?.getLayer('polygonFillLayer') && !mapRef?.getLayer('polygonLineLayer')) {
      mapRef?.addLayer({
        id: 'polygonFillLayer',
        type: 'fill',
        source: 'polygon',
        layout: {},
        paint: {
          'fill-color': '#FFE400',
          'fill-opacity': 0.5,
        },
      });
      mapRef?.addLayer({
        id: 'polygonLineLayer',
        type: 'line',
        source: 'polygon',
        layout: {},
        paint: {
          'line-color': 'red',
          'line-width': 3,
          'line-dasharray': [2, 1],
        },
      });
      addLayerClickHandler(mapRef, 'polygonFillLayer');
    }
  }
};

export const clearLayer = (mapRef: Map | null) => {
  const fillLayer = mapRef?.getLayer('polygonFillLayer');
  const lineLayer = mapRef?.getLayer('polygonLineLayer');

  if (fillLayer && lineLayer) {
    mapRef?.removeLayer('polygonFillLayer');
    mapRef?.removeLayer('polygonLineLayer');
    mapRef?.removeSource('polygon');
  }
};

export const deleteUserLayer = (mapRef: Map | null) => {
  const layerName = prompt('Enter layer name you want to delete: ');
  if (layerName) {
    const layer = mapRef?.getLayer(layerName);
    if (layer) {
      mapRef?.removeSource(layerName);
      mapRef?.removeLayer(layerName);
    }
  }
};

export const setLayerDisplayLevel = (minZoomLevel: number, maxZoomLevel: number, mapRef: Map | null) => {
  if (mapRef) {
    const layer = mapRef.getLayer('polygonFillLayer');

    if (layer) {
      mapRef.setLayerZoomRange('polygonFillLayer', minZoomLevel, maxZoomLevel);
      alert('Zoom range updated for polygonFillLayer');
    } else {
      alert('Layer not found');
    }
  }
};

export const getLayerInfo = (mapRef: Map | null, layerId: string) => {
  const layer = mapRef?.getLayer(layerId);
  // const layerAliasName: string = layer?.metadata.alias;
  const layerMinZoom: number | undefined = layer?.minzoom;
  const layerMaxZoom: number | undefined = layer?.maxzoom;
  // const layerTableName: string = layer?.metadata.tableName;
  // const layerIsSelectable: string = layer?.metadata.selectable;
  return {
    showLayerInfo: () => alert(JSON.stringify(layer, null, 2)),
    // showLayerAliasName: () => alert(layerAliasName),
    showLayerMinZoom: () => alert(layerMinZoom),
    showLayerMaxZoom: () => alert(layerMaxZoom),
    // showLayerTableName: () => alert(layerTableName),
    // showLayerIsSelectable: () => alert(layerIsSelectable),
  };
};

export const layerGetBounds = (mapRef: Map | null) => {
  const sourceData = mapRef?.getSource('polygon');
  if (!sourceData) {
    return;
  }

  if (sourceData.type === 'geojson') {
    const geojsonData = sourceData.serialize().data as GeoJSON.Feature<GeoJSON.Polygon> | undefined;
    const polygonCoordinates = geojsonData?.geometry?.coordinates[0];
    const bounds = new mapboxgl.LngLatBounds();
    polygonCoordinates?.forEach(coord => bounds.extend(coord as [number, number]));

    mapRef?.fitBounds(bounds, { padding: 20 });
  }
};

// get map current bound box
export const getMapBounds = (mapRef: Map | null) => {
  const bounds = mapRef?.getBounds();
  const northeastLng = bounds?._ne.lng;
  const northeastLat = bounds?._ne.lat;
  const southwestLng = bounds?._sw.lng;
  const southwestLat = bounds?._sw.lat;
  const bodyData = {
    minLong: southwestLng,
    minLat: southwestLat,
    maxLong: northeastLng,
    maxLat: northeastLat,
  };
  return bodyData;
};

// match layer style
export const getStyle = (layer: LayerModel, layerStyleList: LayerStyle[]) => {
  layer.styleId = layer.styleId ?? 1;
  const matchedStyle = layerStyleList?.find(layerStyle => layerStyle.id === layer.styleId);
  const parsedLayout = JSON.parse(matchedStyle?.layout);
  if (matchedStyle) {
    return { ...layer, paint: parsedLayout };
  } else {
    return { ...layer, paint: null };
  }
};
