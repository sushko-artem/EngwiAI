describe("EditCollection - smoke", () => {
  beforeEach(() => {
    cy.resetDatabase();
    cy.createAndLoginUser();
  });

  it("should show error when editing collection not found", () => {
    cy.visit("/edit-collection/1234");
    cy.get("[data-testid='no-collection-error']").should("be.visible");
  });
});
