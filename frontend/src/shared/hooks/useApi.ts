import { apiClient } from "@shared/api/client";
import useSWR, { type SWRConfiguration } from "swr";

export const useApi = <T>(endpoint: string, options: SWRConfiguration = {}) => {
  return useSWR<T>(endpoint, () => apiClient.get<T>(endpoint), {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    shouldRetryOnError: (error: Error) => {
      return !error.message.includes("401");
    },
    ...options,
  });
};
