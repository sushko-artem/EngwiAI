describe("CreateCollection - critical", () => {
  beforeEach(() => {
    cy.resetDatabase();
    cy.createAndLoginUser();
    cy.visit("/create-collection");
  });

  it("should render empty collection with 2 empty cards", () => {
    cy.contains("Новая коллекция").should("be.visible");
    cy.get("[data-testid='collection-name-input']").should("have.value", "");
    cy.get("[data-testid='word']").should("have.length", 2);
    cy.get("[data-testid='translation']").should("have.length", 2);
    cy.get("[data-testid='word']").each(($input) => {
      cy.wrap($input).should("have.value", "");
    });
    cy.get("[data-testid='translation']").each(($input) => {
      cy.wrap($input).should("have.value", "");
    });
  });

  it("should navigate back to dashboard", () => {
    cy.get("[data-testid='leftIconAction']").click();
    cy.url().should("include", "/dashboard");
    cy.contains("EngwiAI").should("be.visible");
  });

  it("should save new created collection", () => {
    cy.get("[data-testid='collection-name-input']").type("Фрукты");
    cy.get("[data-testid='word']").eq(0).type("apple");
    cy.get("[data-testid='translation']").eq(0).type("яблоко");
    cy.get("[data-testid='word']").eq(1).type("orange");
    cy.get("[data-testid='translation']").eq(1).type("апельсин");
    cy.get("[data-testid='rightIconAction']").click();
    cy.url().should("include", "/collections");
    cy.contains("Фрукты").should("be.visible");
  });
});
