describe("TestReportPage - smoke", () => {
  beforeEach(() => {
    cy.resetDatabase();
    cy.createAndLoginUser();
    cy.createCollection("animals");
    cy.fixture("collections/animals").as("animals");
  });

  it("should navigate to dashboard page if empty location.state", function () {
    cy.visit("/test-report");
    cy.url().should("contain", "/dashboard");
  });

  it("should contain user mistake in test-report after completing spell-test", function () {
    cy.visit("/spell-check");
    cy.get("[data-testid='chosen-module']").click();
    cy.get("[data-testid='translation']").click();
    cy.get("[data-testid='start-test']").click();
    cy.get("[data-testid='user-answer-textarea']").type("wrong answer-1");
    cy.get("[data-testid='spell-test-answer-button']").click();
    cy.get("[data-testid='user-answer-textarea']").type("wrong answer-2");
    cy.get("[data-testid='spell-test-answer-button']").click();
    cy.answerAllCards(this.animals.cards.slice(2));
    cy.get("[data-testid='modal-action']").eq(0).click();
    cy.url().should("include", "/test-report");
    cy.contains("wrong answer-1").should("be.visible");
    cy.contains("wrong answer-2").should("be.visible");
  });
});
