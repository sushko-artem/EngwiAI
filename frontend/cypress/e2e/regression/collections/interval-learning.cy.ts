describe("IntervalLearningPage - regression", () => {
  beforeEach(() => {
    cy.resetDatabase();
    cy.createAndLoginUser();
    cy.createCollection("animals");
    cy.visit("/interval-learning");
  });

  it("should show warning modal if collection is empty", () => {
    cy.get("[data-testid='interval-action-button']").eq(0).click();
    cy.get("[data-testid='modal-view']").should("be.visible");
  });
});
