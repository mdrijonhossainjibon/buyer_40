import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const API_TIMEOUT = 30000; // 30 seconds

export interface APIResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface APICallProps {
  url: string;
  baseURL?: string; // ✅ added
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  params?: any;
  headers?: any;
}

// Singleton Axios instance with default baseURL
const axiosInstance = axios.create({
  baseURL: `${window.origin}/5000/api/v1/`,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

export const API_CALL = async (props: APICallProps): Promise<APIResponse> => {
  try {
    const config: AxiosRequestConfig = {
      ...props,
      data : props.body,
      headers: {
        ...axiosInstance.defaults.headers,
        ...props.headers,
      },
      baseURL: props.baseURL || axiosInstance.defaults.baseURL, // ✅ support per-request baseURL
    };

    const response: AxiosResponse = await axiosInstance.request(config);

    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || "An error occurred",
      message: error.response?.data?.message || error.message,
    };
  }
};
 

export default API_CALL;
