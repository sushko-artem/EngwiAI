import { AUTH_ENDPOINTS } from "@shared/api";

export const googleAuthRedirect = () => {
  const baseUrl = import.meta.env.VITE_API_URL;
  window.location.href = `${baseUrl}${AUTH_ENDPOINTS.GOOGLE_AUTH}`;
};
