import { useQuery } from '@tanstack/react-query';
import { SidoByCode } from '~/models/Address';
import { fetchApi } from '~/utils/fetchApi';

export const useGetSidoByCode = () => {
  return useQuery({
    queryKey: ['sidoByCode'],
    queryFn: async () => {
      return fetchApi.request<SidoByCode[]>({
        url: '/gis/address/getSidoByCode',
        params: {
          bounds: false,
          geometry: false,
        },
      });
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};
