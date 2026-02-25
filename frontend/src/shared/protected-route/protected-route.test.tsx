import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProtectedRoute } from "./protected-route";

const mockNavigate = vi.hoisted(() => vi.fn());
const mockUseGetMeQuery = vi.hoisted(() => vi.fn());

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  Navigate: ({ to }: { to: string }) => <div>Redirecting to {to}</div>,
}));

vi.mock("@features/auth", () => ({
  useGetMeQuery: mockUseGetMeQuery,
}));

describe("ProtectedRoute", () => {
  it("should redirect to sign-in when no user", () => {
    vi.mocked(mockUseGetMeQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: undefined,
    });
    render(<ProtectedRoute>test</ProtectedRoute>);
    expect(screen.getByText("Redirecting to /sign-in")).toBeInTheDocument();
  });

  it("should render children for authenticated user", () => {
    vi.mocked(mockUseGetMeQuery).mockReturnValue({
      data: { id: 1, email: "test@mail.com" },
      isLoading: false,
      error: undefined,
    });
    render(
      <ProtectedRoute>
        <div>Protected content</div>
      </ProtectedRoute>,
    );
    expect(screen.getByText("Protected content")).toBeInTheDocument();
  });

  it("should navigate to sign-in on refresh token error", () => {
    vi.mocked(mockUseGetMeQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: { status: 401, data: "Refresh token not found" },
    });
    render(<ProtectedRoute>test</ProtectedRoute>);

    expect(mockNavigate).toHaveBeenCalledWith("/sign-in");
  });
});
