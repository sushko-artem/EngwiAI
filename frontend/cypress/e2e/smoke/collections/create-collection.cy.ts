describe("CreateCollection - smoke", () => {
  beforeEach(() => {
    cy.resetDatabase();
    cy.createAndLoginUser();
    cy.visit("/create-collection");
  });

  it("should add new card", () => {
    cy.get("[data-testid='add-card-button']").click();
    cy.get("[data-testid='word']").should("have.length", 3);
    cy.get("[data-testid='translation']").should("have.length", 3);
  });

  it("should delete card", () => {
    cy.get("[data-testid='deleteCross']").eq(0).click();
    cy.get("[data-testid='word']").should("have.length", 1);
    cy.get("[data-testid='translation']").should("have.length", 1);
  });
});
