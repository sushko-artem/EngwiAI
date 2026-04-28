describe("SpellCheckPage - smoke", () => {
  beforeEach(() => {
    cy.resetDatabase();
    cy.createAndLoginUser();
  });

  it("should show empty state when no collections", () => {
    cy.visit("/spell-check");
    cy.contains("Ни одного модуля пока не создано!").should("be.visible");
    cy.contains("создать").should("be.visible");
  });

  it("should navigate to dashboard when click on back", () => {
    cy.createCollection("animals");
    cy.visit("/spell-check");
    cy.get("[data-testid='leftIconAction']").click();
    cy.url().should("include", "/dashboard");
  });

  it("should navigate to spell-check/test page when click on start", () => {
    cy.createCollection("animals");
    cy.visit("/spell-check");
    cy.get("[data-testid='chosen-module']").click();
    cy.get("[data-testid='start-test']").click();
    cy.url().should("include", "spell-check/test");
  });
});
