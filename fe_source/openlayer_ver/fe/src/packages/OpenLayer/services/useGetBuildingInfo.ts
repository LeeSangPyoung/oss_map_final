import { useMutation } from '@tanstack/react-query';
// import { AxiosResponse } from 'axios';
import { fetchApi } from '~/utils/fetchApi';

export const useGetBuildingInfo = () => {
  return useMutation({
    mutationKey: ['building-info'],
    mutationFn: async (buildingCode: string) => {
      const response = await fetchApi.request({
        url: '/gis/3d/building',
        params: {
          code: buildingCode,
        },
        method: 'get',
      });
      return response.data;
    },
  });
};
