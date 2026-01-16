import { vi } from "vitest";

export const createMockFormik = (overrides = {}) => ({
  handleSubmit: vi.fn(),
  handleBlur: vi.fn(),
  handleChange: vi.fn(),
  values: { email: "", password: "" },
  touched: {},
  errors: {},
  status: null,
  isValid: true,
  isSubmitting: false,
  ...overrides,
});
