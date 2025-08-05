import { useQuery } from '@tanstack/react-query';
import { SggByCode } from '~/models/Address';
import { fetchApi } from '~/utils/fetchApi';

export const useGetSggByCode = (id: string) => {
  return useQuery({
    queryKey: ['sggByCode', id],
    queryFn: async () => {
      return fetchApi.request<SggByCode[]>({
        url: '/gis/address/getSggByCode',
        params: {
          admCode: id,
          bounds: false,
          geometry: false,
        },
      });
    },
    enabled: !!id,

    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 2,
  });
};
