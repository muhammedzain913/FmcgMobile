import { Url } from "./userConstant";
import axios from "axios";
import { store } from "./store";
import { setToken } from "./reducer/userReducer";

// Define your API and identity URLs
const API_URL = Url;

export const ApiClient = () => {
  // Create a new axios instance
  const api = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Add a request interceptor to add the JWT token to the authorization header
  api.interceptors.request.use(
    async (config) => {
      console.log('reached request interceptor')
      const token = store.getState().user.userInfo.accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  createAxiosResponseInterceptor();

  function createAxiosResponseInterceptor() {
    const interceptor = api.interceptors.response.use(
      (response) => {
        console.log("RETURN REPONSE INSTEAD ERRRO");
        return response;
      },
      async (error) => {
        console.log('error status',error.response.status);
        // Reject promise if usual error
        if (error.response.status !== 401) {
          console.log("ist case");
          return Promise.reject(error);
        }
        if (
          error.response.status === 401 &&
          store.getState().user?.userInfo?.refreshToken
        ) {
          console.log("second case");
          try {
            console.log('this is the interceptor',interceptor)
            api.interceptors.response.eject(interceptor);
            const refreshToken = store.getState().user.userInfo.refreshToken;
            console.error(
              "Error at API AXIOS",
              error.response.status,
              refreshToken
            );

            const url = `${Url}/api/users/refresh`;

            const body = { refreshToken };
            const headers = {
              "Content-Type": "application/json",
            };

            const response = await axios.post(url, body, { headers: headers });

            // await AsyncStorage.setItem("token", "Bearer " + response.data.access_token);
            // await AsyncStorage.setItem("refreshToken", response.data.refresh_token);

            store.dispatch(
              setToken({
                accessToken: response.data.accessToken,
                refreshToken: response.data.refreshToken,
              })
            );
            console.log("Successfully refresh token");

            error.response.config.headers["Authorization"] =
              "Bearer " + response.data.accessToken;
            return axios(error.response.config);
          } catch (err: any) {
            console.error("Error at refresh token", err.response.status);
            //If refresh token is invalid, you will receive this error status and log user out
            if (err.response.status === 400) {
              console.log("LOGOUT USER");
              store.dispatch(
                setToken({ accessToken: null, refreshToken: null })
              );
              throw { response: { status: 401 } };
            }
            return Promise.reject(err);
          } finally {
            createAxiosResponseInterceptor;
          }
        }
      }
    );

    console.log('this is the interceptor',interceptor)
  }

  const get = (path: string, params?: any) => {
    return api
      .get(path, params ? { params } : undefined)
      .then((response) => response);
  };

  const post = (path: string, body: any, params: any) => {
    console.log('post api called')
    return api.post(path, body, params).then((response) => response);
  };

  const put = (path: string, body: any, params: any) => {
    return api.put(path, body, params).then((response) => response);
  };

  const patch = (path: string, body: any, params: any) => {
    return api.patch(path, body, params).then((response) => response);
  };

  const del = (path: string) => {
    return api.delete(path).then((response) => response);
  };

  return {
    get,
    post,
    patch,
    put,
    del,
  };
};
