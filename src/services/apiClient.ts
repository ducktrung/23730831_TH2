import axios from 'axios';
import {STUDENT} from '@constants/student';

export const apiClient = axios.create({
  baseURL: 'https://fakestoreapi.com',
  timeout: 12000,
  headers: {'Accept': 'application/json'},
});
apiClient.interceptors.request.use(config => {
  config.headers.set('X-Student-Id', STUDENT.mssv);
  return config;
});
