import { Map, GeoJSONSource } from 'mapbox-gl';
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import * as turf from '@turf/turf';

let isDrawing = false;
let startPoint: [number, number] | null = null;
let currentBox: any = null;

const highlightPointsInBox = (mapRef: Map, selectionBox: any, sourceId: string, layerId: string) => {
  // Get all points data from the source
  const sourceData = mapRef.getSource(sourceId) as GeoJSONSource;
  if (!sourceData) {
    console.log('source not found');
    return;
  }

  const originalCircleColor = mapRef?.getPaintProperty(layerId, 'circle-color') || '';
  const originalCircleRadius = mapRef?.getPaintProperty(layerId, 'circle-radius') || 0;
  const originalCircleOpacity = mapRef?.getPaintProperty(layerId, 'circle-opacity') || 0;

  const geojsonData = sourceData.serialize().data as GeoJSON.FeatureCollection;
  const pointsWithinBox = geojsonData?.features.filter((feature: any) => {
    return turf.booleanPointInPolygon(feature.geometry, selectionBox.features[0].geometry);
  });

  console.log('point within box: ', pointsWithinBox);

  // Highlight selected points by updating their style
  pointsWithinBox.forEach(point => {
    if (!point.properties) {
      point.properties = {};
    }
    point.properties.isSelected = true;
  });

  const updatedData: FeatureCollection<Geometry, GeoJsonProperties> = {
    type: 'FeatureCollection',
    features: pointsWithinBox,
  };
  sourceData.setData(updatedData);

  // layer for selected Points
  mapRef?.addLayer({
    id: 'highlightPoint',
    type: 'circle',
    source: sourceId,
    paint: {
      'circle-color': '#FF0000', // Red color for selected points
      'circle-radius': 4, // Radius size for the selected points
      'circle-opacity': 0.8,
    },
    filter: ['==', ['get', 'isSelected'], true],
  });

  // layer for non-selected poins
  mapRef?.addLayer({
    id: 'originalPoint',
    type: 'circle',
    source: sourceId,
    paint: {
      'circle-color': originalCircleColor,
      'circle-radius': originalCircleRadius,
      'circle-opacity': originalCircleOpacity,
    },
    filter: ['!=', ['get', 'isSelected'], true],
  });
};

const initializeSelectionBox = (mapRef: Map, source: string, layer: string) => {
  mapRef?.dragPan.disable();

  // Add a source and layer for the selection box
  mapRef.addSource('selectionBox', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [],
    },
  });

  mapRef.addLayer({
    id: 'selectionBoxLayer',
    type: 'fill',
    source: 'selectionBox',
    paint: {
      'fill-color': 'rgba(255, 255, 255, 0.5)',
      'fill-opacity': 0.4,
      'fill-outline-color': '#000000',
    },
  });

  // Mouse down event to start drawing the box
  mapRef.on('mousedown', event => {
    if (!event.originalEvent.shiftKey) {
      return;
    }
    isDrawing = true;
    startPoint = [event.lngLat.lng, event.lngLat.lat];
    mapRef.getCanvas().style.cursor = 'default';
  });

  // Mouse move event to update the box while drawing
  mapRef.on('mousemove', event => {
    if (!isDrawing || !startPoint) {
      return;
    }
    const currentPoint = [event.lngLat.lng, event.lngLat.lat];

    // Create a GeoJSON polygon representing the selection box
    const coordinates = [
      [startPoint, [currentPoint[0], startPoint[1]], currentPoint, [startPoint[0], currentPoint[1]], startPoint],
    ];

    currentBox = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: coordinates,
          },
        },
      ],
    };

    // Update the selection box source with new coordinates
    (mapRef.getSource('selectionBox') as GeoJSONSource).setData(currentBox);
  });

  // Mouse up event to finalize the selection
  mapRef.on('mouseup', () => {
    if (!isDrawing) {
      return;
    }
    isDrawing = false;
    mapRef.getCanvas().style.cursor = 'pointer';

    if (currentBox) {
      highlightPointsInBox(mapRef, currentBox, source, layer);
    }

    // Clear the selection box after the selection is done
    (mapRef.getSource('selectionBox') as GeoJSONSource).setData({
      type: 'FeatureCollection',
      features: [],
    });
    startPoint = null;
    currentBox = null;
    mapRef?.dragPan.enable();
  });
};

const clearSelectedLayer = (mapRef: Map, layer: string) => {
  mapRef?.removeLayer('highlightPoint');
  mapRef?.removeLayer(layer);
};

export { initializeSelectionBox, clearSelectedLayer };
