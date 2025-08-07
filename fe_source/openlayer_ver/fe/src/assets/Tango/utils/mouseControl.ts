import MousePosition from 'ol/control/MousePosition.js';
import { Coordinate } from 'ol/coordinate';

interface Params {
  onCoordinateChange: (coordinate?: Coordinate) => void;
}
export const mousePositionControl = ({ onCoordinateChange }: Params) => {
  return new MousePosition({
    coordinateFormat: coord => {
      onCoordinateChange(coord);
      return '';
    },
    projection: 'EPSG:4326',
    // comment the following two lines to have the mouse position
    // be placed within the map.
    className: 'hidden',
    target: document.getElementById('mouse-position') ?? '',
  });
};
