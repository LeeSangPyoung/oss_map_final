import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { LayerModel } from '~/models/Layer';
import { fetchApi } from '~/utils/fetchApi';

const fetchLayerApi = async () => {
  try {
    const response: AxiosResponse<LayerModel[]> = await fetchApi.request({
      url: '/gis/layers',
      method: 'get',
    });
    //return response.data;
    const filterNames = [
        "nodeBusinessPlan",
        "nodeExcavationSite",
        "nodeGreenBelt",
        "nodePublicToilet",
        "nodeRoadsideTrees",
        "linkDsWay",
        "linkSafeWayHome",
        "polygonHump"
    ];

    const filteredData = response.data.filter(layer => filterNames.includes(layer.name));

    return filteredData;


  } catch (err) {
    console.log(err);
    return [];
  }
};

export const createLayerApi = async (data: LayerModel) => {
  try {
    const response: AxiosResponse<LayerModel[]> = await fetchApi.request({
      url: '/gis/layers',
      method: 'post',
      data: data,
    });
    return response.data;
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const updateLayerConfigApi = async (data: LayerModel) => {
  try {
    const response: AxiosResponse<LayerModel> = await fetchApi.request({
      url: `/gis/layers/${data.id}/config`,
      method: 'put',
      data,
    });
    console.log(response);
    return response.data;
  } catch (err) {
    console.log('Error updating layer:', err);
    throw err;
  }
};

export const deleteLayerApi = async (layerId: number) => {
  try {
    await fetchApi.request({
      url: `/gis/layers/${layerId}`,
      method: 'delete',
    });
  } catch (err) {
    console.log('Error deleting layer:', err);
    throw err;
  }
};

export const useGetLayerList = () => {
  return useQuery({
    queryKey: ['layer-list'],
    queryFn: fetchLayerApi,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: Infinity,
    gcTime: 1000,
  });
};
