import { describe, expect, it } from "vitest";
import { shuffler } from "./shuffler";

describe("shuffler", () => {
  it("should not mutate original array", () => {
    const input = ["a", "b", "c"];
    const copy = [...input];
    shuffler(input);
    expect(input).toEqual(copy);
  });

  it("should return array with same elements", () => {
    const input = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const result = shuffler(input);
    expect(result.sort()).toEqual(input.sort());
  });

  it("should actually shuffle", () => {
    const input = Array.from({ length: 100 }, (_, i) => i);
    let diffCount = 0;
    for (let i = 0; i < 10; i++) {
      const result = shuffler(input);
      const isSame = result.every((v, idx) => v === input[idx]);
      if (!isSame) diffCount++;
    }
    expect(diffCount).toBeGreaterThan(0);
  });
});
