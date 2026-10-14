import {
  api,
  AI_ENDPOINTS,
  type IGenerateSentencesRequest,
  type IGenerationResponse,
} from "@shared/api";

export const aiApi = api.injectEndpoints({
  endpoints: (builder) => ({
    generateSentences: builder.mutation<
      IGenerationResponse,
      IGenerateSentencesRequest
    >({
      query: (dto) => ({
        url: AI_ENDPOINTS.GENERATE_SENTENCES,
        method: "POST",
        body: dto,
      }),
    }),
    getMode: builder.query<{ isMockMode: boolean }, void>({
      query: () => AI_ENDPOINTS.MODE,
    }),
  }),
});

export const { useGenerateSentencesMutation, useGetModeQuery } = aiApi;
