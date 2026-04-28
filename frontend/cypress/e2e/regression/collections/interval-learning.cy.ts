describe("IntervalLearningPage - regression", () => {
  let collectionId: string;
  beforeEach(() => {
    cy.resetDatabase();
    cy.createAndLoginUser();
    cy.fixture("collections/animals").as("animals");
    cy.createCollection("animals").then((animals) => {
      collectionId = animals.id;
    });
  });

  it("should show warning modal if collection is empty", () => {
    cy.visit("/interval-learning");
    cy.get("[data-testid='interval-action-button']").eq(0).click();
    cy.get("[data-testid='modal-view']").should("be.visible");
  });

  it("should correctly handle saving cards status when working with interval-learning", function () {
    cy.visit("/interval-learning");
    cy.get("[data-testid='interval-action-button']").eq(1).click();
    cy.get("[data-testid='chosen-status-button']").eq(0).click();
    cy.get("[data-testid='chosen-status-button']").eq(0).click();
    for (let i = 2; i < this.animals.cards.length; i++) {
      cy.get("[data-testid='chosen-status-button']").eq(1).click();
    }
    cy.contains("Завершить").click();
    cy.url().should("contain", "/dashboard");
    cy.contains("Весь материал").click();
    cy.get("[data-testid='collection-length']")
      .eq(0)
      .should("have.text", `${this.animals.cards.length - 2}`);
    cy.get("[data-testid='collection-length']").eq(1).should("have.text", "2");
  });

  it("should correctly handle saving cards status when working with original collection", function () {
    cy.visit(`/flash-cards/${collectionId}`);
    cy.get("[data-testid='chosen-status-button']").eq(1).click();
    cy.get("[data-testid='chosen-status-button']").eq(1).click();
    for (let i = 2; i < this.animals.cards.length; i++) {
      cy.get("[data-testid='chosen-status-button']").eq(0).click();
    }
    cy.contains("Выбрать другой").click();
    cy.url().should("include", "/collections");
    cy.get("[data-testid='leftIconAction']").click();
    cy.contains("Весь материал").click();
    cy.get("[data-testid='collection-length']").eq(0).should("have.text", "2");
    cy.get("[data-testid='collection-length']")
      .eq(1)
      .should("have.text", `${this.animals.cards.length - 2}`);
  });
});
