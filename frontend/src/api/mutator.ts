import Axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { API_BASE_URL } from './config';

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const source = Axios.CancelToken.source();
  const promise = Axios({
    ...config,
    ...options,
    baseURL: API_BASE_URL,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};

export default customInstance;

// Error handling type
export type ErrorType<Error> = AxiosError<Error>;
