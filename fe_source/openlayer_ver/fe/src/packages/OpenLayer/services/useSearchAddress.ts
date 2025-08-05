import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { fetchApi } from '~/utils/fetchApi';

interface ResponseSearch {
  lat: string;
  lon: string;
}
export const useSearchAddress = () => {
  return useMutation({
    mutationKey: ['search-address'],
    mutationFn: async (address: string) => {
      const response: AxiosResponse<ResponseSearch> = await fetchApi.request({
        url: '/gis/address/searchAddress',
        params: {
          name: address,
        },
        method: 'get',
      });
      return response.data;
    },
  });
};
