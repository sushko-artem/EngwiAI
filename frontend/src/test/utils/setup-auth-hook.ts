/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLoginMutation, useRegisterMutation } from "@features/auth";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { vi } from "vitest";
import { createMockFormik } from "./create-mock-formik";
import { renderHook, type RenderHookResult } from "@testing-library/react";
import type { useSignIn } from "@features/auth/hooks/useSignIn";
import type { useSignUp } from "@features/auth/hooks/useSignUp";

type AuthHookOverridesType = {
  formik?: Partial<ReturnType<typeof useFormik>>;
  mutation?: {
    isLoading?: boolean;
    reset?: () => void;
  };
};

type AuthHookSetupResult<T> = {
  result: RenderHookResult<T, unknown>["result"];
  mockAction: ReturnType<typeof vi.fn>;
  mockNavigate: ReturnType<typeof vi.fn>;
  capturedOnSubmit: (...args: any[]) => any;
};

type HookReturnType = ReturnType<typeof useSignIn | typeof useSignUp>;

export const setupAuthHook = <T extends HookReturnType>(
  useHook: () => T,
  overrides: AuthHookOverridesType = {}
): AuthHookSetupResult<T> => {
  const mockAction = vi.fn();
  const mockNavigate = vi.fn();
  const hookName = useHook.name || useHook.toString();
  let capturedOnSubmit: any;

  const mutationConfig = {
    isLoading: overrides.mutation?.isLoading ?? false,
    reset: overrides.mutation?.reset ?? vi.fn(),
  };

  if (hookName.includes("SignIn")) {
    vi.mocked(useLoginMutation).mockReturnValue([mockAction, mutationConfig]);
  } else {
    vi.mocked(useRegisterMutation).mockReturnValue([
      mockAction,
      mutationConfig,
    ]);
  }

  vi.mocked(useNavigate).mockReturnValue(mockNavigate);

  vi.mocked(useFormik).mockImplementation((config) => {
    capturedOnSubmit = config.onSubmit;

    return createMockFormik(overrides?.formik) as any;
  });

  const { result } = renderHook(() => useHook());

  return {
    mockAction,
    mockNavigate,
    capturedOnSubmit,
    result: result as { current: T },
  };
};
