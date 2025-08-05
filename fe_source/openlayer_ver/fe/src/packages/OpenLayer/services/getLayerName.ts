import { AxiosResponse } from 'axios';
import { LayerModel } from '~/models/Layer';
import { fetchApi } from '~/utils/fetchApi';

interface StyleConfigResponse {
  id: number;
  name: string;
  configs: {
    type: 'POLYGON' | 'LINESTRING' | 'POINT';
    options: string;
    filter: any;
  }[];
}

export const getLayerNameApi = async (layerName: string) => {
  try {
    const response: AxiosResponse<LayerModel> = await fetchApi.request({
      url: '/gis/layers/find',
      method: 'get',
      params: {
        name: layerName,
      },
    });
    return response.data;
  } catch (err) {
    return undefined;
  }
};

export const createLayerWithName = async (layerName: string) => {
  try {
    const response: AxiosResponse<LayerModel> = await fetchApi.request({
      url: '/gis/layers',
      method: 'post',
      data: {
        name: layerName,
      },
    });
    return response.data;
  } catch (err) {
    return undefined;
  }
};

export const updateConfigLayer = async (layerId: number, params: Record<string, any> | null) => {
  try {
    const response = await fetchApi.request({
      url: `/gis/layers/${layerId}/config`,
      method: 'put',
      data: {
        ...params,
      },
    });
    return response.data;
  } catch (err) {
    console.log('Error updating style layer:', err);
    throw err;
  }
};
export const findCustomStyleName = async (styleName: string) => {
  try {
    const response: AxiosResponse<StyleConfigResponse> = await fetchApi.request({
      url: `/gis/custom-styles/find`,
      method: 'get',
      params: {
        name: styleName,
      },
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
};
export const createCustomStyles = async (data: StyleConfigResponse) => {
  try {
    const response: AxiosResponse<StyleConfigResponse> = await fetchApi.request({
      method: 'POST',
      data,
      url: '/gis/custom-styles',
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
};
