import { apiClient } from "@shared/api/client";
import { COLLECTION_ENDPOINTS } from "@shared/api/endpoints/collection";
import type {
  ICollectionDto,
  ICollectionResponse,
} from "@shared/api/types/collection";

export const collectionsService = {
  create: (dto: ICollectionDto): Promise<ICollectionResponse> =>
    apiClient.post(COLLECTION_ENDPOINTS.CREATE, dto),
  getList: (): Promise<ICollectionResponse[]> =>
    apiClient.get(COLLECTION_ENDPOINTS.LIST),
};
