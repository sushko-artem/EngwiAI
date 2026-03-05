describe("FlashCards - critical", () => {
  let collectionId: string;
  beforeEach(() => {
    cy.resetDatabase();
    cy.createAndLoginUser();
    cy.fixture("collections/animals").as("animals");
    cy.createCollection("animals").then((animals) => {
      collectionId = animals.id;
      cy.visit(`/flash-cards/${collectionId}`);
    });
  });

  it("should render correct flash-cards collection", function () {
    cy.url().should("include", `/flash-cards/${collectionId}`);
    cy.contains(this.animals.name).should("be.visible");
    cy.contains(this.animals.cards[0].word).should("be.visible");
    cy.get("[data-testid='progress-bar']").should("be.visible");
    cy.contains(`1/${this.animals.cards.length}`).should("be.visible");
    cy.get("[data-testid='chosen-status-button']").should("have.length", 2);
    cy.get("[data-testid='leftIconAction']").should("be.visible");
    cy.get("[data-testid='rightIconAction']").should("be.visible");
  });
});
