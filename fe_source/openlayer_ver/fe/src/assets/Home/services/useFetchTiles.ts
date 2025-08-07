import { AxiosResponse } from 'axios';
import { BBoxInfo } from '~/models/BBoxInfo';
import { fetchApi } from '~/utils/fetchApi';

export const postTilesInfoApi = async (data: any): Promise<BBoxInfo | undefined> => {
  const { request, object, type } = data;

  try {
    const response: AxiosResponse<BBoxInfo> = await fetchApi.request({
      url: `/gis/titles/bbox-info?object=${object}&type=${type}`,
      method: 'post',
      data: request,
    });
    return response.data;
  } catch (err) {
    console.log(err);
    return undefined;
  }
};
