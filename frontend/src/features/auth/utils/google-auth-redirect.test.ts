import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { googleAuthRedirect } from "./google-auth-redirect";

describe("googleAuthRedirect", () => {
  const originalLocation = window.location;
  beforeEach(() => {
    Object.defineProperty(window, "location", {
      value: {
        href: "http://initial.com",
      },
      writable: true,
      configurable: true,
    });

    vi.stubEnv("VITE_API_URL", "https://api.example.com");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    Object.defineProperty(window, "location", {
      value: originalLocation,
      writable: true,
      configurable: true,
    });
  });

  it("should construct correct Google auth URL", () => {
    googleAuthRedirect();
    expect(window.location.href).toBe("https://api.example.com/auth/google");
  });
});
