import { apiClient } from "@shared/api/client";
import { COLLECTION_ENDPOINTS } from "@shared/api/endpoints/collection";
import type {
  ICollectionDto,
  ICollectionResponse,
  ICollectionCardsResponse,
  IUpdateCollectionDto,
} from "@shared/api/types/collection";

export const collectionsService = {
  create: (dto: ICollectionDto): Promise<ICollectionResponse> =>
    apiClient.post(COLLECTION_ENDPOINTS.CREATE, dto),
  update: (id: string, dto: IUpdateCollectionDto) =>
    apiClient.post(`${COLLECTION_ENDPOINTS.UPDATE}/${id}`, dto),
  getList: (): Promise<ICollectionResponse[]> =>
    apiClient.get(COLLECTION_ENDPOINTS.LIST),
  getOne: (id: string): Promise<ICollectionCardsResponse> =>
    apiClient.get(`${COLLECTION_ENDPOINTS.GET_ONE}${id}`),
};
