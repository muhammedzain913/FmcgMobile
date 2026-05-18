import { Url } from "./userConstant";
import axios from "axios";
import { store } from "./store";
import { setToken } from "./reducer/userReducer";

const api = axios.create({
  baseURL: Url,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = store.getState().user.userInfo.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

function createAxiosResponseInterceptor() {
  const interceptor = api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response.status !== 401) {
        return Promise.reject(error);
      }
      if (!store.getState().user?.userInfo?.refreshToken) {
        return Promise.reject(error);
      }
      api.interceptors.response.eject(interceptor);
      try {
        const refreshToken = store.getState().user.userInfo.refreshToken;
        const response = await axios.post(
          `${Url}/api/users/refresh`,
          { refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );
        store.dispatch(
          setToken({
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
          })
        );
        error.response.config.headers["Authorization"] =
          "Bearer " + response.data.accessToken;
        return api(error.response.config);
      } catch (err: any) {
        if (err.response?.status === 400) {
          store.dispatch(setToken({ accessToken: null, refreshToken: null }));
          throw { response: { status: 401 } };
        }
        return Promise.reject(err);
      } finally {
        createAxiosResponseInterceptor();
      }
    }
  );
}

createAxiosResponseInterceptor();

export const ApiClient = () => ({
  get: (path: string, params?: any) =>
    api.get(path, params ? { params } : undefined).then((r) => r),
  post: (path: string, body: any, params: any) =>
    api.post(path, body, params).then((r) => r),
  put: (path: string, body: any, params: any) =>
    api.put(path, body, params).then((r) => r),
  patch: (path: string, body: any, params: any) =>
    api.patch(path, body, params).then((r) => r),
  del: (path: string) => api.delete(path).then((r) => r),
});
