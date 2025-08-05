import axios from 'axios';
import { env } from '~/env';

export const fetchApi = axios.create({
  baseURL: env.backendUrl,
  method: 'get',
  headers: {
    'Content-Type': 'application/json',
  },
});
