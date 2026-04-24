describe("SpellCheckPage - critical", () => {
  beforeEach(() => {
    cy.resetDatabase();
    cy.createAndLoginUser();
    cy.createCollection("animals");
    cy.createCollection("food");
    cy.fixture("collections/food").as("food");
    cy.fixture("collections/animals").as("animals");
    cy.visit("/spell-check");
  });

  it("should show warning modal when no choosen module", () => {
    cy.get("[data-testid='start-test']").click();
    cy.get("[data-testid='modal-view']").should("be.visible");
  });

  it("should show word side in test by default", function () {
    cy.get("[data-testid='chosen-module']").first().click();
    cy.get("[data-testid='start-test']").click();
    cy.contains(this.animals.cards[0].word).should("be.visible");
  });

  it("should show translation side in test when translation side chosen", function () {
    cy.get("[data-testid='chosen-module']").first().click();
    cy.get("[data-testid='translation']").click();
    cy.get("[data-testid='start-test']").click();
    cy.contains(this.animals.cards[0].translation).should("be.visible");
  });
});
