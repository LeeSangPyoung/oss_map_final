export interface LayerModel {
  id?: number;
  label?: string;
  value?: string;
  name?: string;
  type?: string;
  object?: string;
  layout?: string;
  styleId?: number;
  alias?: string;
  editable?: boolean;
  geomColumn?: string;
  geometryType?: string;
  keyColumns?: string;
  maxZoom: number;
  minZoom: number;
  selectable?: boolean;
  tableName?: string;
  visible?: boolean;
  optionsStyle?: string | null;
  styleName?: string;
}
