import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ModalView } from "./modal-view";

describe("ModalView", () => {
  it("should render WARN mode with only close button", () => {
    render(
      <ModalView mode="WARN" message="Warning" actions={{ cancel: vi.fn() }} />,
    );

    expect(screen.getByText("Warning")).toBeInTheDocument();
    expect(screen.getByAltText("close")).toBeInTheDocument();
    expect(screen.queryByAltText("confirm")).not.toBeInTheDocument();
  });

  it("should render CONFIRM mode with both button", () => {
    render(
      <ModalView
        mode="CONFIRM"
        message="Are you sure?"
        actions={{ confirm: vi.fn(), cancel: vi.fn() }}
      />,
    );

    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    expect(screen.getByAltText("close")).toBeInTheDocument();
    expect(screen.queryByAltText("confirm")).toBeInTheDocument();
  });
});
