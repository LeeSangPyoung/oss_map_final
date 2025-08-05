import { Map } from 'ol';
import { Coordinate } from 'ol/coordinate';

export class openLayerMap {
  private map: Map;
  public center: Coordinate;
  constructor(initMap: Map) {
    this.map = initMap;
  }
  public setCenter(center: Coordinate) {
    this.center = center;
  }
}
