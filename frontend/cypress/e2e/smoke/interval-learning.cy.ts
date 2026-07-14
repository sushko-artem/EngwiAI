describe("IntervalLearningPage - smoke", () => {
  beforeEach(() => {
    cy.resetDatabase();
    cy.createAndLoginUser();
    cy.createCollection("animals");
    cy.visit("/interval-learning");
  });

  it("should navigate to '/dashboard' page after confirming action when clicking back and status has been selected", function () {
    cy.get("[data-testid='interval-action-button']").eq(1).click();
    cy.get("[data-testid='chosen-status-button']").eq(0).click();
    cy.get("[data-testid='leftIconAction']").click();
    cy.get("[data-testid='modal-view']").should("be.visible");
    cy.get("img[alt='confirm']").click();
    cy.url().should("include", `/dashboard`);
  });
});
