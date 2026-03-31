describe("IntervalLearning - critical", () => {
  beforeEach(() => {
    cy.resetDatabase();
    cy.createAndLoginUser();
    cy.fixture("collections/animals").as("animals");
  });

  it("should show an advice to create first collection", () => {
    cy.visit("/interval-learning");
    cy.contains("Ни одного модуля пока не создано!").should("be.visible");
  });

  it("should render correct inactive collection length", function () {
    cy.createCollection("animals");
    cy.visit("/interval-learning");
    cy.get("[data-testid='collection-length']").eq(0).should("have.text", "0");
    cy.get("[data-testid='collection-length']")
      .eq(1)
      .should("have.text", `${this.animals.cards.length}`);
  });
});
