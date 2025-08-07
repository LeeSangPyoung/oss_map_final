import { create } from 'zustand';
import { Vector as VectorSource } from 'ol/source';
import { useMapbase } from './useMapbase';
import { CustomVectorLayer } from '~/assets/OpenLayer/utils/customVectorLayer';
import { createLayerWithName } from '~/assets/OpenLayer/services/getLayerName';

export interface LayerStore {
  layers: Map<string, CustomVectorLayer>; // Map lưu các layer theo tên
  addLayer: (name: string) => void;
  getLayer: (name: string) => CustomVectorLayer | undefined;
  clearLayers: () => void; // Xóa tất cả layer
  removeLayerByName?: (name: string) => void;
}

export const useLayerStore = create<LayerStore>((set, get) => ({
  layers: new Map(),

  /**
   * Hàm thêm layer vào map và lưu vào store.
   * @param {string} name - Tên của layer.
   * @param {OLMap} map - Đối tượng bản đồ OpenLayers.
   * @param {VectorLayerOptions<VectorSource>} [options] - Tùy chọn cho layer Vector (nếu có).
   */
  addLayer: async (name: string) => {
    const { map } = useMapbase.getState();
    const { layers } = get();

    if (layers.has(name)) {
      console.warn(`Layer với tên "${name}" đã tồn tại.`);
      return;
    }

    const newLayer = new CustomVectorLayer({
      source: new VectorSource(),
    });

    map?.addLayer(newLayer);
    newLayer.set('name', name);
    layers.set(name, newLayer);
    set({ layers }); // Cập nhật store với layer mới
  },

  /**
   * Hàm lấy layer theo tên từ store.
   * @param {string} name - Tên của layer cần lấy.
   * @returns {CustomVectorLayer | undefined} - Layer tương ứng hoặc undefined nếu không tồn tại.
   */
  getLayer: (name: string) => {
    const { layers } = get();
    return layers.get(name);
  },

  /**
   * Hàm xóa tất cả các layer trong store và trên bản đồ.
   */
  clearLayers: () => {
    // const { layers } = get();
    // layers.forEach(layer => layer.getSource().);
    set({ layers: new Map() }); // Reset lại store
  },
  removeLayerByName: (name: string) => {
    const { layers } = get();
    layers.delete(name);
  },
}));
