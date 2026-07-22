export type TestType = "spell" | "grammar";

export const TEST_ROUTES: Record<TestType, string> = {
  spell: "/spell-check",
  grammar: "/grammar-check",
};
