import mapboxgl, { Map, LngLat } from 'mapbox-gl';
import React, { useState, useEffect, useRef } from 'react';
import Toolbar from '~/components/Toolbar/Toolbar';
import BottomControl from '~/packages/Tango/components/BottomControl';
import RightControl from '~/packages/Tango/components/RightControl';
import { initialConfig } from '~/pages/Mapbox/MapboxPage';
import { AutoCompleteSearch } from '~/packages/Tango/components/AutoCompleteSearch';
import { Slider } from 'antd';
import { env } from '~/env';
import { mockLocations } from '~/utils/common';

export default function MapboxMap() {
  const [map, setMap] = useState<Map | undefined>(undefined);
  const [mousePosition, setMousePosition] = useState<LngLat | undefined>([]);
  const mapRef = useRef<Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [zoomLevel, setZoomLevel] = useState(initialConfig.zoom);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    mapboxgl.accessToken = env.mapboxToken;
    if (!mapRef?.current || mapContainerRef?.current) {
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
      mapRef.current.on('style.load', () => {
        mapRef.current?.setFog({});
      });
    }
    mapRef?.current?.dragRotate.disable();
    mapRef?.current?.on('mousemove', e => {
      setMousePosition(e.lngLat);
    });
    mapRef.current.on('zoom', () => {
      setZoomLevel(mapRef.current!.getZoom());
    });
    return () => {
      mapRef.current?.remove();
    };
  }, [mapContainerRef.current, mapRef]);

  const handleZoomChange = (zoom: number) => {
    mapRef?.current?.zoomTo(zoom);
    setZoomLevel(zoom);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // if (value.toLowerCase().includes(mockLocations.name.toLowerCase())) {
    //   setSuggestions([mockLocation]);
    // } else {
    //   setSuggestions([]);
    // }
  };

  const handleSearch = () => {
    const location = mockLocations.find(loc => loc.name.toLowerCase() === query.toLowerCase());
    if (location) {
      if (mapRef.current) {
        mapRef.current.flyTo({
          center: location.coordinates,
          zoom: 14,
        });
      }
    } else {
      console.log('Location not found');
    }
  };

  // const handleSuggestionClick = location => {
  //   setQuery(location.name);
  //   setSuggestions([]);

  //   if (mapRef.current) {
  //     mapRef.current.flyTo({
  //       center: location.coordinates,
  //       zoom: 14,
  //     });
  //   }
  // };
  return (
    <div className="relative flex w-full flex-col">
      <Toolbar />
      <div ref={mapContainerRef} className="size-full" />
      <AutoCompleteSearch query={query} onSearch={handleSearch} onChange={handleInputChange} />
      <div className="absolute right-[9px] top-[46px] z-[99] flex h-6 w-[23px] items-center justify-center rounded-t border bg-white text-xs">
        {mapRef.current?.getZoom() && Math.round(mapRef.current?.getZoom())}
      </div>
      <Slider
        min={1}
        max={17}
        step={0.1}
        value={zoomLevel}
        onChange={handleZoomChange}
        vertical
        className="absolute right-[4px] top-[76px] h-[28%]"
      />
      <RightControl />
      <BottomControl lat={mousePosition?.lat ?? null} lng={mousePosition?.lat ?? null} />
    </div>
  );
}
