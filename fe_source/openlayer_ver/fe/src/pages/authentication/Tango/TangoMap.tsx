import { Map, MapBrowserEvent } from 'ol';
import { Coordinate } from 'ol/coordinate';
import React, { useEffect } from 'react';
import Toolbar from '~/components/Toolbar/Toolbar';
import { mapDawulayerBase, onTransformLayer } from '~/packages/OpenLayer/utils/dawulerLayer';
import BottomControl from '~/packages/Tango/components/BottomControl';
import { mousePositionControl } from '~/packages/Tango/utils/mouseControl';
import { useMapbase } from '~/store/useMapbase';
import { ZoomSlider } from 'ol/control.js';
import 'ol/ol.css';
import '~/packages/Tango/styles/styles.css';
import RightControl from '~/packages/Tango/components/RightControl';
import SearchAddress from '~/components/SearchAddress/SearchAddress';
import { useGetLayerList } from '~/packages/Home/services/useGetLayers';
import { useGetBuildingInfo } from '~/packages/OpenLayer/services/useGetBuildingInfo';
import { useFeatureInfoStore } from '~/store/useFeatureInfoStore';

export default function TangoMap() {
  const { defaultOptions, setMap } = useMapbase();
  const [mousePosition, setMousePosition] = React.useState<Coordinate | undefined>([]);
  const mapRef = React.useRef<Map | null>(null);

  const { data: layerData } = useGetLayerList();
  const setFeatureInfo = useFeatureInfoStore((state: any) => state.setFeatureInfo);
  const { mutateAsync: fetchBuildingInfo } = useGetBuildingInfo();

  const handleClick = async (event: MapBrowserEvent<any>) => {
    const features = mapRef.current?.getFeaturesAtPixel(event.pixel);
    if (features && features.length > 0) {
      const { values_ } = features[0];
      if (values_.bld_cd) {
        try {
          const response = await fetchBuildingInfo(values_.bld_cd);
          console.log('response: ', response);
          if (!!response) {
            setFeatureInfo(response);
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
  };

  useEffect(() => {
    if (!!layerData && mapRef.current) {
      const layers = onTransformLayer(layerData);
      layers?.forEach(layer => {
        mapRef.current?.addLayer(layer);
      });
    }

    mapRef.current?.on('click', handleClick);
    return () => {
      mapRef.current?.un('click', handleClick);
    };
  }, [layerData]);

  useEffect(() => {
    if (!!defaultOptions) {
      if (!mapRef.current) {
        const initMap = mapDawulayerBase(defaultOptions, 'openlayer-2');
        const zoomslider = new ZoomSlider();
        initMap.addControl(
          mousePositionControl({
            onCoordinateChange(coordinate) {
              setMousePosition(coordinate);
            },
          }),
        );
        initMap.addControl(zoomslider);

        mapRef.current = initMap;
        setMap(initMap);
      }
    }
  }, [defaultOptions]);

  return (
    <div className="relative flex w-full flex-col">
      <Toolbar />
      <div id="openlayer-2" className="size-full">
        <div className="absolute right-[9px] top-[46px] z-[99] flex h-6 w-[23px] items-center justify-center rounded-t border bg-white text-xs">
          {mapRef.current?.getView().getZoom()}
        </div>
      </div>
      <RightControl />
      <BottomControl lat={mousePosition?.[0] ?? null} lng={mousePosition?.[1] ?? null} />
    </div>
  );
}
