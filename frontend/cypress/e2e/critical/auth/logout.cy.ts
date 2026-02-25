describe("Logging out - critical", () => {
  beforeEach(() => {
    cy.resetDatabase();
  });

  it("should logged out when clicking LogOut", () => {
    cy.createAndLoginUser();
    cy.visit("/dashboard");
    cy.get("button[data-testid='rightIconAction']").click();
    cy.url().should("include", "/sign-in");
  });
});
