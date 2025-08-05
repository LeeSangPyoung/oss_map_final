import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { LayerStyles } from '~/models/Styles';
import { fetchApi } from '~/utils/fetchApi';

export const useGetLayerStyles = () => {
  return useQuery({
    queryKey: ['layer-styles'],
    queryFn: async () => {
      const response: AxiosResponse<LayerStyles[]> = await fetchApi.request({
        url: '/gis/styles',
        method: 'get',
      });
      return response.data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: Infinity,
    gcTime: 1000,
  });
};
