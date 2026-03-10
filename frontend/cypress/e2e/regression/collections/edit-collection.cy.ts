describe("EditCollection - regression", () => {
  let collectionId: string;
  beforeEach(() => {
    cy.resetDatabase();
    cy.createAndLoginUser();
    cy.createCollection("animals").then((animals) => {
      collectionId = animals.id;
      cy.visit(`/edit-collection/${animals.id}`);
    });
  });

  it("should prevent navigation when editing collection has changes", () => {
    cy.get("[data-testid='collection-name-input']").type("-edited");
    cy.get("[data-testid='leftIconAction']").click();
    cy.get("[data-testid='modal-view']").should("be.visible");
    cy.url().should("include", `/edit-collection/${collectionId}`);
  });
});
