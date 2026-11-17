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
  }),
});

export const { useGenerateSentencesMutation } = aiApi;
