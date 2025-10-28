import {
  api,
  COLLECTION_ENDPOINTS,
  type ICollectionCardsResponse,
  type ICollectionDto,
  type ICollectionResponse,
  type IUpdateCollectionDto,
} from "@shared/api";

export const collectionsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCollections: builder.query<ICollectionResponse[], void>({
      query: () => COLLECTION_ENDPOINTS.LIST,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Collection" as const, id })),
              { type: "Collection", id: "LIST" },
            ]
          : [{ type: "Collection", id: "LIST" }],
    }),
    createCollection: builder.mutation<ICollectionResponse, ICollectionDto>({
      query: (dto) => ({
        url: COLLECTION_ENDPOINTS.CREATE,
        method: "POST",
        body: dto,
      }),
      invalidatesTags: [{ type: "Collection", id: "LIST" }],
    }),
    updateCollection: builder.mutation<
      { success: boolean },
      { id: string; dto: IUpdateCollectionDto }
    >({
      query: ({ id, dto }) => ({
        url: `${COLLECTION_ENDPOINTS.UPDATE}/${id}`,
        method: "POST",
        body: dto,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Collection", id },
        { type: "Collection", id: "LIST" },
      ],
    }),
    getCollection: builder.query<ICollectionCardsResponse, string>({
      query: (id) => `${COLLECTION_ENDPOINTS.GET_ONE}${id}`,
      providesTags: (_, __, id) => [{ type: "Collection", id }],
    }),
  }),
});

export const {
  useGetCollectionsQuery,
  useCreateCollectionMutation,
  useGetCollectionQuery,
  useUpdateCollectionMutation,
} = collectionsApi;
