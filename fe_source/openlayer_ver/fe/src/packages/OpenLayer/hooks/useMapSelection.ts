import { Map } from 'ol';
import { click } from 'ol/events/condition';
import { Select } from 'ol/interaction';
import Layer from 'ol/layer/Layer';
import { useState } from 'react';

interface Props {
  map: Map | null;
  layers: Array<Layer>;
}
export const useMapSelection = () => {
  const [selectInteraction, setSelectInteract] = useState<Select | null>(null);
  const initSelect = ({ map, layers }: Props) => {
    const selectInteraction = new Select({
      condition: click,
      multi: false,
      layers: layers, // Chọn từ cả hai layer
      filter: feature => {
        const mode = feature.get('mode');
        if (mode && feature.getGeometry()?.getType() === 'Point') {
          return false;
        }
        return true;
      },
    });
    setSelectInteract(selectInteraction);
    map?.addInteraction(selectInteraction);
  };
  return {
    initSelect,
    selectInteraction,
  };
};
