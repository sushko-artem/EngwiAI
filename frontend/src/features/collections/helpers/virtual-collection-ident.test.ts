import { describe, expect, it } from "vitest";
import { isVirtualCollection } from "./virtual-collection-ident-helper";

describe("isVirtualCollection", () => {
  it("should return correct boolean value", () => {
    expect(isVirtualCollection("inactive")).toBe(true);
    expect(isVirtualCollection("active")).toBe(true);
    expect(isVirtualCollection("3h54bb123e")).toBe(false);
  });
});
