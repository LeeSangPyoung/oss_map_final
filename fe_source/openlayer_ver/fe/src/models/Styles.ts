export interface StylesDraw {
  id: string;
  type: 'POINT' | 'LINE_STRING' | 'POLYGON' | 'TEXT';
  options?: {
    markerType?: 'icon' | 'circle';
    iconUrl?: string;
    iconSize: [number, number];
    radius: number;
    fillColor?: string;
    strokeColor?: string;
    weight?: number;
    dashArray?: string;
  };
}

export interface LayerStyles {
  id: number;
  styleName: string;
  styleType: string;
  options?: string | null;
  customStyleName?: string;
}

export interface OptionStyle {
  radius: number;
  fillColor?: string;
  color?: string;
  width?: number;
}
