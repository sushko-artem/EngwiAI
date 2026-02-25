describe("Dashboard - critical", () => {
  beforeEach(() => {
    cy.createAndLoginUser();
    cy.visit("/dashboard");
  });

  it("should load dashboard for authenticated user", () => {
    cy.contains("Модули").should("be.visible");
    cy.contains("Создать модуль").should("be.visible");
  });

  it("should have working navigation to modules", () => {
    cy.contains("Модули").click();
    cy.url().should("include", "/collections");
  });

  it("should have working navigation to create-collection page", () => {
    cy.contains("Создать модуль").click();
    cy.url().should("include", "/create-collection");
  });
});
