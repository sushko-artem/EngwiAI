describe("SpellTestPage - smoke", () => {
  beforeEach(() => {
    cy.resetDatabase();
    cy.createAndLoginUser();
    cy.createCollection("animals");
    cy.fixture("collections/animals").as("animals");
  });

  it("should redirect to selection if no modules chosen", () => {
    cy.visit("/spell-check/test");
    cy.url().should("include", "/spell-check");
    cy.get("[data-testid='start-test']").should("be.visible");
  });

  it("should load spell test page without errors", function () {
    cy.visit("/spell-check");
    cy.get("[data-testid='chosen-module']").click();
    cy.get("[data-testid='translation']").click();
    cy.get("[data-testid='start-test']").click();
    cy.get("[data-testid='spell-test-answer-button']").should("be.visible");
    cy.get("[data-testid='user-answer-textarea']").should("be.visible");
    cy.contains(this.animals.cards[0].translation).should("be.visible");
  });
});
