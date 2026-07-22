describe("Collections - Smoke", () => {
  beforeEach(() => {
    cy.resetDatabase();
    cy.createAndLoginUser();
  });

  it("should show empty state when no collections", () => {
    cy.visit("/collections");
    cy.contains("Ни одного модуля пока не создано!").should("be.visible");
    cy.contains("создать").should("be.visible");
  });

  it("should navigate to create-collection page", () => {
    cy.visit("/collections");
    cy.contains("создать").click();
    cy.url().should("include", "/create-collection");
  });
});
