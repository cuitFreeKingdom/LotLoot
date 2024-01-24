import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
} from "axios";

const instance: AxiosInstance = axios.create({
  baseURL: 'http://118.24.38.111:8080',
});

instance.interceptors.request.use(
  // @ts-ignore
  (config: AxiosRequestConfig) => {
    // 增加token
    const token: string | null = localStorage.getItem("token"); // 获取token方式因情况决定
    token && ((config.headers as AxiosRequestHeaders).Authorization = token);
    return config;
  },
  (error) => {
    // console.log("filter resquest error:", error);
  }
);

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return Promise.resolve(response.data);
  },
  (error) => {
    // console.log("response error", error);
    return Promise.resolve(error);
  }
);

export default instance;