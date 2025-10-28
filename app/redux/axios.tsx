import axios from 'axios';
import { Url } from './userConstant';
import { store } from './store';

const axiosConfig = axios.create({
  baseURL: Url, //replace with your BaseURL
  headers: {
    'Content-Type': 'application/json', // change according header type accordingly
  },
});

axiosConfig.interceptors.request.use(
  (config) => {
    const accessToken = store.getState().user.userInfo.accessToken
    console.log(accessToken)
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`; // set in header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosConfig;