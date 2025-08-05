import { useEffect, useRef, useState } from 'react';
import mapboxgl, { Map, LngLatLike, LayerSpecification, GeoJSONSource } from 'mapbox-gl';
import { Feature, FeatureCollection, Point } from 'geojson';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
// useMapHistory는 Mapbox에서는 사용하지 않음 (OpenLayers 전용)
// import { useMapHistory } from '~/hooks/useHistoryMapBox';
import { centerPoint, featuresList } from '~/utils/common';
import { useContextMenu } from 'react-contexify';
import ClickMenu from '~/packages/Home/components/ClickMenu';
import { MenuItem } from '~/models/MenuItem';
import { clearSelectedLayer, initializeSelectionBox } from '~/packages/Home/components/InteractiveSelectionMapBox';
import { useGetLayerList } from '~/packages/Home/services/useGetLayers';
import { useGetLayerStyles } from '~/packages/Home/services/useGetStylesLayers';
import { postTilesInfoApi } from '~/packages/Home/services/useFetchTiles';
import { env } from '~/env';
import DragCircleMode, { withCircleSupport } from 'mapboxgl-draw-circle-drag';
import {
  getCenter,
  getZoom,
  getMinZoom,
  getMaxZoom,
  panToView,
  fitBoundsView,
  setView,
  setZoom,
  zoomOut,
  zoomIn,
  setLayerStyle,
  addData,
  layerGetBounds,
  setLayerDisplayLevel,
  clearLayer,
  getMapBounds,
  deleteUserLayer,
  getStyle,
  resetLayerStyle,
} from '~/packages/Home/components/MapBoxControlFunctions';
import { LayerModel } from '~/models/Layer';
import LayerConfigModal from '~/packages/Home/components/LayerConfigModal';
import { Button } from 'antd';

type LayerType = 'symbol' | 'fill' | 'raster' | 'circle' | 'line' | 'background' | 'heatmap' | 'hillshade';

interface MapConfig {
  style: string;
  center: LngLatLike;
  zoom: number;
  pitch: number;
  bearing: number;
}

export const initialConfig: MapConfig = {
  style: 'mapbox://styles/mapbox/streets-v12', // style ban đầu
  center: centerPoint, // tọa độ ban đầu
  zoom: 13, // mức zoom ban đầu
  pitch: 0, // góc nhìn ban đầu
  bearing: 0, // hướng nhìn ban đầu
};

const menuId = 'map-context-menu';

function Mapbox() {
  const [map, setMap] = useState<Map | undefined>(undefined);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  // Mapbox에서는 히스토리 기능을 사용하지 않음
  // const { back, forward } = useMapHistory(map);
  const [toggle, setToggle] = useState(true);
  const drawRef = useRef<MapboxDraw | null>(null);
  const [isDrawPolygonModeOn, setIsDrawPolygonModeOn] = useState(false);
  const [isDrawLineModeOn, setIsDrawLineModeOn] = useState(false);
  const [isDrawPointModeOn, setIsDrawPointModeOn] = useState(false);
  const [isDrawCircleModeOn, setIsDrawCircleModeOn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedFeatures, setSelectedFeatures] = useState(null);

  const originalOptions = [
    {
      label: 'Zoom In',
      onClick: () => mapRef?.current?.zoomIn({ duration: 1000 }),
    },
    {
      label: 'Zoom Out',
      onClick: () => mapRef?.current?.zoomOut({ offset: [80, 60] }),
    },
  ];

  const [optionData, setOptionData] = useState<MenuItem[]>(originalOptions);

  const { show } = useContextMenu({ id: menuId });
  const { data: layerList } = useGetLayerList();
  const { data: layerStyleList } = useGetLayerStyles();

  const handleContextMenu = (event: MouseEvent) => {
    event.preventDefault();
    const rect = mapContainerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      show({
        event,
        id: menuId,
        position: { x, y },
      });
    }
  };

  const handleFetchTileInfo = async (object: string | undefined, value: string | undefined) => {
    const body = getMapBounds(mapRef?.current);
    const requestData = {
      request: body,
      object: object,
      type: value,
    };

    const response = await postTilesInfoApi(requestData);
    return response?.features;
  };

  const addSelectedFeatureLayer = (map: Map | null) => {
    if (map && !map?.getLayer('selected-feature-layer')) {
      map?.addSource('selected-feature-layer', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });

      map?.addLayer({
        id: 'selected-feature-outer-circle',
        type: 'circle',
        source: 'selected-feature-layer',
        paint: {
          'circle-radius': 12, // Bán kính lớn hơn một chút so với feature
          'circle-color': 'transparent', // Không tô màu bên trong (rỗng)
          'circle-stroke-color': 'red', // Màu của outline
          'circle-stroke-width': 2,
        },
      });
      map?.addLayer({
        id: 'selected-feature-inner-circle',
        type: 'circle',
        source: 'selected-feature-layer', // Replace with your source ID
        paint: {
          'circle-radius': 6, // Bán kính bằng với kích thước của feature gốc
          'circle-color': 'red',
        },
      });
    }
  };

  const bringingHighlightLayerToFront = () => {
    const layerId = 'selected-feature-inner-circle';
    if (mapRef?.current?.getLayer(layerId)) {
      mapRef?.current?.moveLayer(layerId);
    }
  };

  const handleFeatureClick = (feature: any) => {
    const geometry = typeof feature.geometry === 'string' ? JSON.parse(feature.geometry) : feature.geometry;
    const properties = typeof feature.properties === 'string' ? JSON.parse(feature.properties) : feature.properties;

    const parsedFeature = {
      type: 'Feature',
      geometry: geometry,
      id: properties.OBJECTID,
    };
    setSelectedFeatures(parsedFeature);
  };

  const buildLayerMap = (mapRef: Map | null) => {
    layerList?.forEach(async (layerItem: LayerModel) => {
      const mergedLayer = getStyle(layerItem, layerStyleList);
      const {
        value,
        object,
        type,
        layout,
        minZoom,
        maxZoom,
        selectable,
        tableName,
        visible,
        geomColumn,
        geometryType,
        alias,
        paint,
      } = mergedLayer;
      const metadata = { visible, selectable, alias, tableName, geometryType, geomColumn };
      let features;
      try {
        const rawFeatures = await handleFetchTileInfo(object, value);
        features = rawFeatures?.map(feature => {
          const { geometry, properties } = feature;
          const parsedGeometry = typeof geometry === 'string' ? JSON.parse(geometry) : geometry || {};
          const parsedProperties = typeof properties === 'string' ? JSON.parse(properties) : properties || {};
          const newFeature = {
            ...feature,
            type: 'Feature',
            geometry: parsedGeometry,
            properties: parsedProperties,
          };
          return newFeature;
        });
      } catch (err) {
        console.error('Error fetching tile info: ', err);
        return; // Stop further execution for this layer if the fetch fails
      }
      if (!value || !type || !object) {
        console.warn('Layer item is missing required fields:', { value, type, object });
        return;
      }

      if (!!mapRef && !mapRef.getSource(value)) {
        mapRef.addSource(value, {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: features,
          },
        });
      } else {
        const source = mapRef?.getSource(value) as GeoJSONSource;
        source.setData({
          type: 'FeatureCollection',
          features: features,
        });
      }

      if (mapRef && mapRef.getLayer && !mapRef.getLayer(value)) {
        try {
          const parsedPaint = typeof paint === 'string' ? JSON.parse(paint) : paint || {};
          const parsedLayout = typeof layout === 'string' ? JSON.parse(layout) : layout || {};
          mapRef.addLayer({
            id: value,
            type: type as LayerType,
            source: value,
            layout: {
              ...parsedLayout,
              visibility: toggle ? 'visible' : 'none',
            },
            paint: parsedPaint,
            metadata: metadata as any,
            maxzoom: maxZoom,
            minzoom: minZoom,
          });
          mapRef?.on('click', value, e => {
            if (e.features && e.features.length > 0) {
              const clickedFeature = e.features[0];
              handleFeatureClick(clickedFeature);

              const source = mapRef?.getSource('selected-feature-layer') as GeoJSONSource;
              bringingHighlightLayerToFront();

              if (source) {
                source.setData({
                  type: 'FeatureCollection',
                  features: [clickedFeature],
                });
              }
            }
          });
        } catch (error) {
          console.error('Failed to parse paint and layout property:', error);
        }
      }
    });
  };

  useEffect(() => {
    mapboxgl.accessToken = env.mapboxToken;
    if (mapContainerRef.current) {
      const initialMap = new mapboxgl.Map({
        ...initialConfig,
        container: mapContainerRef.current,
        projection: {
          name: 'lambertConformalConic',
          center: [-40, 0],
          parallels: [90, 90],
        },
      });
      mapRef.current = initialMap;
      mapRef.current.setMinZoom(1);
      mapRef.current.setMaxZoom(17);
      setMap(initialMap);

      mapRef.current.boxZoom.disable();
      // mapRef.current.addControl(new mapboxgl.NavigationControl());
      mapRef?.current?.on('load', () => {
        addSelectedFeatureLayer(mapRef?.current);
        buildLayerMap(mapRef?.current);
      });
      mapRef.current.on('style.load', () => {
        mapRef.current?.setFog({}); // Set the default atmosphere style
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
      });
    }
    mapRef?.current?.dragRotate.disable();
    mapContainerRef?.current?.addEventListener('contextmenu', handleContextMenu);
    return () => {
      mapRef.current?.remove();
    };
  }, [mapContainerRef.current, mapRef]);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    } // Ensure map instance is available

    // Initialize Mapbox Draw and store in drawRef
    drawRef.current = new MapboxDraw({
      displayControlsDefault: false,
      userProperties: true,
      controls: {
        polygon: true,
        line_string: true,
        point: true,
        trash: true,
      },
      modes: {
        ...MapboxDraw.modes,
        drag_circle: DragCircleMode,
        direct_select: withCircleSupport('direct_select'),
        simple_select: withCircleSupport('simple_select'),
      },
      styles: [
        // ACTIVE (being drawn)
        // line stroke
        {
          id: 'gl-draw-line',
          type: 'line',
          filter: ['all', ['==', '$type', 'LineString']],
          layout: {
            'line-cap': 'round',
            'line-join': 'round',
          },
          paint: {
            'line-color': '#03F',
            'line-dasharray': [0.2, 2],
            'line-width': 4,
          },
        },
        // ACTIVE (being drawn) Point Style
        {
          id: 'gl-draw-point-active',
          type: 'circle',
          filter: ['all', ['==', '$type', 'Point'], ['==', 'meta', 'feature']],
          paint: {
            'circle-radius': 7,
            'circle-color': '#FF0000', // Active point color (red)
          },
        },
        // INACTIVE (already drawn) Point Style
        {
          id: 'gl-draw-point-inactive',
          type: 'circle',
          filter: ['all', ['==', '$type', 'Point'], ['!=', 'meta', 'feature']],
          paint: {
            'circle-radius': 5,
            'circle-color': '#FF0000', // Inactive point color (blue)
          },
        },
        // polygon fill
        {
          id: 'gl-draw-polygon-fill',
          type: 'fill',
          filter: ['all', ['==', '$type', 'Polygon']],
          paint: {
            'fill-color': '#03F',
            'fill-outline-color': '#FF00FF',
            'fill-opacity': 0.4,
          },
        },
        // polygon mid points
        {
          id: 'gl-draw-polygon-midpoint',
          type: 'circle',
          filter: ['all', ['==', '$type', 'Point'], ['==', 'meta', 'midpoint']],
          paint: {
            'circle-radius': 3,
            'circle-color': '#fbb03b',
          },
        },
        // polygon outline stroke
        {
          id: 'gl-draw-polygon-stroke-active',
          type: 'line',
          filter: ['all', ['==', '$type', 'Polygon']],
          layout: {
            'line-cap': 'round',
            'line-join': 'round',
          },
          paint: {
            'line-color': '#D20C0C',
            'line-dasharray': [0.2, 2],
            'line-width': 2,
          },
        },
      ],
    });

    // Add the draw control to the map
    mapRef?.current?.addControl(drawRef.current);

    // Cleanup function to remove draw controls when component unmounts
    return () => {
      if (drawRef.current && mapRef?.current?.hasControl(drawRef.current)) {
        mapRef?.current?.removeControl(drawRef.current);
      }
    };
  }, [mapRef.current]); // Re-run the effect when map changes

  useEffect(() => {
    if (!mapRef) {
      return;
    }

    const updateLayers = () => {
      buildLayerMap(mapRef?.current);
    };
    map?.on('moveend', updateLayers);
    map?.on('zoomend', updateLayers);
    return () => {
      map?.off('moveend', updateLayers);
      map?.off('zoomend', updateLayers);
      layerList?.forEach(layerItem => {
        const layerId = layerItem.value;
        if (mapRef?.current?.getLayer(layerId)) {
          mapRef?.current?.off('click', layerId);
        }
      });
    };
  }, [buildLayerMap, layerList]);

  const handleToggleDrawPolygonMode = () => {
    // initializeMap();
    drawRef?.current?.deleteAll();
    if (isDrawPolygonModeOn) {
      // Disable draw mode
      drawRef?.current?.changeMode('simple_select');
      drawRef?.current?.deleteAll();
    } else {
      // Enable draw mode
      drawRef?.current?.changeMode('draw_polygon');
    }
    setIsDrawPolygonModeOn(!isDrawPolygonModeOn);
  };

  const handleToggleDrawLineMode = () => {
    // initializeMap();
    drawRef?.current?.deleteAll();
    if (isDrawLineModeOn) {
      // Disable draw mode
      drawRef?.current?.changeMode('simple_select');
      drawRef?.current?.deleteAll();
    } else {
      // Enable draw mode
      drawRef?.current?.changeMode('draw_line_string');
    }
    setIsDrawLineModeOn(!isDrawLineModeOn);
  };

  const handleToggleDrawPointMode = () => {
    // initializeMap();
    drawRef?.current?.deleteAll();
    if (isDrawPointModeOn) {
      // Disable draw mode
      drawRef?.current?.changeMode('simple_select');
      drawRef?.current?.deleteAll();
    } else {
      // Enable draw mode
      drawRef?.current?.changeMode('draw_point');
    }
    setIsDrawPointModeOn(!isDrawPointModeOn);
  };

  const handleToggleDrawCircleMode = () => {
    // initializeMap();
    drawRef?.current?.deleteAll();
    if (isDrawCircleModeOn) {
      // Disable draw mode
      drawRef?.current?.changeMode('simple_select');
      drawRef?.current?.deleteAll();
    } else {
      // Enable draw mode
      drawRef?.current?.changeMode('drag_circle');
    }
    setIsDrawCircleModeOn(!isDrawCircleModeOn);
  };

  const showLayer = () => {
    setToggle(prev => !prev);
    layerList?.forEach(layerItem => {
      if (!layerItem.value) {
        console.log("no layer's value founded");
        return;
      }

      const layer = mapRef.current?.getLayer(layerItem.value);
      if (!!layer) {
        const layerId = layer.id;
        if (!!toggle) {
          mapRef.current?.setLayoutProperty(layerId, 'visibility', 'none');
        } else {
          mapRef.current?.setLayoutProperty(layerId, 'visibility', 'visible');
        }
      }
    });
  };

  const getLayerById = () => {
    return mapRef?.current?.getLayer('nodeGreenBelt');
  };

  const showLayerInfoById = () => {
    const layer = getLayerById() as LayerSpecification;
    if (layer) {
      alert(JSON.stringify(layer, null, 2));
    }
  };

  const getLayerByAliasName = () => {
    const layer = getLayerById() as LayerSpecification;
    if (layer) {
      const aliasName = layer.metadata.alias;
      alert(aliasName);
    }
  };

  const getLayerMinZoom = () => {
    const layer = getLayerById() as LayerSpecification;
    if (layer) {
      const layerMinZoom = layer.minzoom;
      alert(layerMinZoom);
    }
  };
  const getLayerMaxZoom = () => {
    const layer = getLayerById() as LayerSpecification;
    if (layer) {
      const layerMaxZoom = layer.maxzoom;
      alert(layerMaxZoom);
    }
  };

  const getLayerTableName = () => {
    const layer = getLayerById() as LayerSpecification;
    if (layer) {
      const layerTableName = layer.metadata.tableName;
      alert(layerTableName);
    }
  };
  const getLayerSelectable = () => {
    const layer = getLayerById() as LayerSpecification;
    if (layer) {
      const layerIsSelectable = layer.metadata.selectable;
      alert(layerIsSelectable);
    }
  };

  const refreshLayer = () => {
    layerList?.forEach(async (layerItem: LayerModel) => {
      const layer = getStyle(layerItem, layerStyleList);
      const { value, object, type, paint, layout, metadata, minZoom, maxZoom } = layer;
      const currentLayer = mapRef?.current?.getLayer(value);
      if (currentLayer) {
        mapRef?.current?.removeLayer(value);
      }
      if (mapRef?.current?.getSource(value)) {
        mapRef?.current?.removeSource(value);
      }
      let features;
      try {
        const rawFeatures = await handleFetchTileInfo(object, value);
        features = rawFeatures?.map(feature => {
          const { geometry, properties } = feature;
          const parsedGeometry = typeof geometry === 'string' ? JSON.parse(geometry) : geometry || {};
          const parsedProperties = typeof properties === 'string' ? JSON.parse(properties) : properties || {};
          const newFeature = {
            ...feature,
            type: 'Feature',
            geometry: parsedGeometry,
            properties: parsedProperties,
          };
          return newFeature;
        });
      } catch (err) {
        console.error('Error fetching tile info: ', err);
        return;
      }
      if (!value || !type || !object) {
        console.warn('Layer item is missing required fields:', { value, type, object });
        return;
      }

      if (!!mapRef && !mapRef?.current?.getSource(value)) {
        mapRef?.current?.addSource(value, {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: features,
          },
        });
      } else {
        const source = mapRef?.current?.getSource(value) as GeoJSONSource;
        source.setData({
          type: 'FeatureCollection',
          features: features,
        });
      }

      if (mapRef && !mapRef?.current?.getLayer(value)) {
        try {
          const parsedPaint = typeof paint === 'string' ? JSON.parse(paint) : paint || {};
          const parsedLayout = typeof layout === 'string' ? JSON.parse(layout) : layout || {};
          mapRef?.current?.addLayer({
            id: value,
            type: type as LayerType,
            source: value,
            layout: {
              ...parsedLayout,
              visibility: toggle ? 'visible' : 'none',
            },
            paint: parsedPaint,
            metadata: metadata as any,
            maxzoom: maxZoom,
            minzoom: minZoom,
          });
        } catch (error) {
          console.error('Failed to parse paint and layout property:', error);
        }
      }
    });
  };

  // Function to add the population layer dynamically
  const thematicsLayerStyle = () => {
    if (!mapRef?.current) {
      return;
    }

    // Check if the layer already exists to prevent adding it multiple times
    if (mapRef?.current?.getLayer('population-layer')) {
      alert('Population layer already added!');
      return;
    }

    // Adding a GeoJSON source with population data
    mapRef?.current?.addSource('population-data', {
      type: 'geojson',
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: { population: 400 },
            geometry: {
              type: 'Point',
              coordinates: [126.975706345605, 37.5595025938127],
            },
          },
          {
            type: 'Feature',
            properties: { population: 800 },
            geometry: {
              type: 'Point',
              coordinates: [127.242289345605, 37.3687805938127], // Point 2
            },
          },
          {
            type: 'Feature',
            properties: { population: 1200 },
            geometry: {
              type: 'Point',
              coordinates: [126.882289345605, 37.3687805938127], // Point 3
            },
          },
        ],
      },
    });

    // Adding a layer with population-based styling
    mapRef?.current?.addLayer({
      id: 'population-layer',
      type: 'circle',
      source: 'population-data',
      paint: {
        // Set the circle color based on population
        'circle-color': [
          'step',
          ['get', 'population'], // get the population property from GeoJSON
          'blue', // Color if population < 500
          500, // Threshold 1
          'green', // Color if 500 <= population < 1000
          1000, // Threshold 2
          '#F03B20', // Color if population >= 1000
        ],
        'circle-radius': [
          'step',
          ['get', 'population'], // Adjust radius based on population
          50, // Radius if population < 500
          500,
          100, // Radius if 500 <= population < 1000
          1000,
          150, // Radius if population >= 1000
        ],
      },
    });
    alert('Population layer added!');
  };

  const setEditContextMenu = () => {
    const newContextMenu = [
      { label: 'Menu 1', onClick: () => alert('Menu 1') },
      { label: 'Menu 2', onClick: () => alert('Menu 2') },
    ];

    setOptionData(newContextMenu);
  };

  const handleAddTextLayer = () => {
    const userInput = prompt('Enter value for both title and ID:');
    const data = map?.getCenter();
    const lat = data?.lat.toFixed(14);
    const lng = data?.lng.toFixed(14);

    // Ensure the user input is provided
    if (userInput && map) {
      // Add a new source and layer to the map with the same value for both title and ID
      map.addSource(userInput, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [lng, lat], // Set coordinates for the text layer
              },
              properties: {
                title: userInput, // Set title and id to the same user input
              },
            },
          ],
        },
      });

      map.addLayer({
        id: userInput, // Use the same value for the layer ID
        type: 'symbol',
        source: userInput,
        layout: {
          'text-field': ['get', 'title'], // Set the text field to the title property
          'text-size': 60,
          'text-offset': [0, 0.5],
          'text-anchor': 'top',
        },
        paint: {
          'text-color': '#ff0000', // Text color (customizable)
        },
      });
    } else {
      alert('A value is required.');
    }
  };

  const generateRandomPoints = (): FeatureCollection<Point> => {
    const features: Feature<Point>[] = [];

    featuresList.forEach(feature => {
      const { type, coordinates } = feature;
      features.push({
        type: 'Feature',
        geometry: {
          type: type,
          coordinates: coordinates,
        },
        properties: {
          isSelected: false,
        },
      });
    });
    console.log('feature: ', features);
    return {
      type: 'FeatureCollection',
      features: features,
    };
  };

  const createRandomPointsLayer = () => {
    const randomPointsGeoJSON = generateRandomPoints();
    mapRef.current?.addSource('randomPoints', {
      type: 'geojson',
      data: randomPointsGeoJSON,
    });

    // Add the layer to visualize the points
    mapRef.current?.addLayer({
      id: 'randomPointsLayer',
      type: 'circle',
      source: 'randomPoints',
      paint: {
        'circle-color': '#0000ff', // Blue color
        'circle-radius': 6,
      },
    });
  };

  const refreshMap = () => {
    if (!map) {
      return;
    }
    const allLayers = mapRef?.current?.getStyle()?.layers || [];
    allLayers.forEach(layer => {
      if (mapRef?.current?.getLayer(layer.id)) {
        mapRef?.current?.removeLayer(layer.id);
      }
    });
    const customSources = map?.getStyle()?.sources || {};
    Object.keys(customSources).forEach(sourceId => {
      if (map?.getSource(sourceId)) {
        map?.removeSource(sourceId);
      }
    });
    map?.setCenter(initialConfig.center);
    map?.setZoom(initialConfig.zoom);
    map?.setPitch(initialConfig.pitch || 0);
    map?.setBearing(initialConfig.bearing || 0);

    if (drawRef?.current) {
      drawRef?.current?.deleteAll();
    }
    map?.setStyle(initialConfig.style);
  };

  const handleOpenLayerModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseLayerModal = () => {
    setIsModalOpen(false);
  };

  const handleClearSelectedFeature = () => {
    const source = map?.getSource('selected-feature-layer') as GeoJSONSource;
    if (source) {
      source.setData({
        type: 'FeatureCollection',
        features: [],
      });
    }
  };

  return (
    <div className="container mx-auto">
      <div ref={mapContainerRef} className="map-container mt-[20px] h-[500px] w-full border border-red-500" />
      <ClickMenu menuId={menuId} options={optionData} />
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Button className="mt-3" size="large" onClick={() => getCenter(mapRef.current)}>
          Get Screen Center Point
        </Button>
        <Button className="mt-3" size="large" onClick={() => getZoom(mapRef.current)}>
          Get Current Zoom Level
        </Button>
        <Button className="mt-3" size="large" onClick={() => getMinZoom(mapRef.current)}>
          Get Minimum Zoom Level
        </Button>
        <Button className="mt-3" size="large" onClick={() => getMaxZoom(mapRef.current)}>
          Get Maximum Zoom Level
        </Button>
        <Button className="mt-3" size="large" onClick={refreshMap}>
          Refresh All
        </Button>
        <Button className="mt-3" size="large" onClick={() => panToView(mapRef?.current)}>
          Move Center Point
        </Button>
        <Button className="mt-3" size="large" onClick={() => fitBoundsView(mapRef?.current)}>
          Move Area
        </Button>
        <Button className="mt-3" size="large" onClick={() => setView(mapRef?.current)}>
          Move Center Point and Change Level
        </Button>
        <Button className="mt-3" size="large" onClick={() => setZoom(mapRef?.current)}>
          Adjust Scale
        </Button>
        <Button className="mt-3" size="large" onClick={() => zoomOut(mapRef?.current)}>
          Zoom Out Map
        </Button>
        <Button className="mt-3" size="large" onClick={() => zoomIn(mapRef?.current)}>
          Zoom In Map
        </Button>
        <Button className="mt-3" size="large" onClick={() => setLayerDisplayLevel(13, 17, mapRef?.current)}>
          Set Layer Zoom Range
        </Button>
        <Button className="mt-3" size="large" onClick={back}>
          Previous Screen
        </Button>
        <Button className="mt-3" size="large" onClick={forward}>
          Next Screen
        </Button>
        <Button className="mt-3" size="large" onClick={showLayerInfoById}>
          Get Layer
        </Button>
        <Button className="mt-3" size="large" onClick={handleToggleDrawPolygonMode}>
          {isDrawPolygonModeOn ? 'Disable Draw Polygon Mode' : 'Enable Draw Polygon Mode'}
        </Button>
        <Button className="mt-3" size="large" onClick={handleToggleDrawLineMode}>
          {isDrawLineModeOn ? 'Disable Draw Line Mode' : 'Enable Draw Line Mode'}
        </Button>
        <Button className="mt-3" size="large" onClick={handleToggleDrawPointMode}>
          {isDrawPointModeOn ? 'Disable Draw Point Mode' : 'Enable Draw Point Mode'}
        </Button>
        <Button className="mt-3" size="large" onClick={handleToggleDrawCircleMode}>
          {isDrawCircleModeOn ? 'Disable Draw Circle Mode' : 'Enable Draw Circle Mode'}
        </Button>
        <Button className="mt-3" size="large" onClick={showLayerInfoById}>
          View Layer Information
        </Button>
        <Button className="mt-3" size="large" onClick={getLayerByAliasName}>
          External Layer Name
        </Button>
        <Button className="mt-3" size="large" onClick={getLayerMaxZoom}>
          Maximum Display Zoom Level
        </Button>
        <Button className="mt-3" size="large" onClick={getLayerMinZoom}>
          Minimum Display Zoom Level
        </Button>
        <Button className="mt-3" size="large" onClick={getLayerTableName}>
          Table Name of Layer
        </Button>
        <Button className="mt-3" size="large" onClick={getLayerSelectable}>
          Selectable Facility
        </Button>
        <Button className="mt-3" size="large" onClick={refreshLayer}>
          Refresh Layer
        </Button>
        <Button className="mt-3" size="large" onClick={() => addData(mapRef?.current)}>
          Add User Layer Feature
        </Button>
        <Button className="mt-3" size="large" onClick={handleAddTextLayer}>
          Add User Layer
        </Button>
        <Button className="mt-3" size="large" onClick={() => clearLayer(mapRef?.current)}>
          Initialize User Layer
        </Button>
        <Button className="mt-3" size="large" onClick={() => deleteUserLayer(mapRef?.current)}>
          Delete User Layer
        </Button>
        <Button className="mt-3" size="large" onClick={() => layerGetBounds(mapRef?.current)}>
          Entire Area of User Layer
        </Button>
        <Button
          className="mt-3"
          size="large"
          onClick={() => setLayerStyle(mapRef?.current, 'nodeGreenBelt', layerStyleList?.[4])}
        >
          Set Layer Style
        </Button>
        <Button
          className="mt-3"
          size="large"
          onClick={() => resetLayerStyle(mapRef?.current, 'nodeGreenBelt', layerStyleList)}
        >
          Restore Layer Display
        </Button>
        <Button className="mt-3" size="large" onClick={thematicsLayerStyle}>
          Thematics Layer Style
        </Button>
        <Button className="mt-3" size="large" onClick={setEditContextMenu}>
          Edit Mode Right-Click Menu Configuration
        </Button>
        {/* <Button
          className="mt-3"
          size="large"
          onClick={() => initializeSelectionBox(mapRef?.current as Map, 'randomPoints', 'randomPointsLayer')}
        >
          Highlight mode
        </Button> */}
        <Button className="mt-3" size="large" onClick={showLayer}>
          {toggle ? 'Toggle Hide' : 'Toggle Display'}
        </Button>
        <Button className="mt-3" size="large" onClick={() => alert(JSON.stringify(selectedFeatures))}>
          Return Selected Facility
        </Button>
        <Button className="mt-3" size="large" onClick={handleClearSelectedFeature}>
          Deselect Facility
        </Button>
        <Button className="mt-3" size="large" onClick={handleOpenLayerModal}>
          Config Layer
        </Button>
      </div>
      <LayerConfigModal isOpen={isModalOpen} onClose={handleCloseLayerModal} layerList={layerList} />
    </div>
  );
}

export default Mapbox;
