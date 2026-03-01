describe("Collections - regression", () => {
  let collectionsIds: string[] = [];

  beforeEach(() => {
    cy.resetDatabase();
    cy.createAndLoginUser();
    cy.createCollection("animals").then((collection) => {
      collectionsIds.push(collection.id);
    });
    cy.createCollection("food").then((collection) => {
      collectionsIds.push(collection.id);
    });
    cy.visit("/collections");
  });

  afterEach(() => {
    collectionsIds = [];
  });

  it("should delete collection after confirmation", () => {
    cy.contains("Животные")
      .parent()
      .find("[data-testid='deleteCross']")
      .click();
    cy.contains("Удалить коллекцию Животные?").should("be.visible");
    cy.get("[data-testid='modal-actions']").find("div:first").click();
    cy.contains("Животные").should("not.exist");
    cy.contains("Еда").should("be.visible");
  });

  it("should cancel deletion", () => {
    cy.contains("Еда").parent().find("[data-testid='deleteCross']").click();
    cy.contains("Удалить коллекцию Еда?").should("be.visible");
    cy.get("[data-testid='modal-actions']").find("div:last").click();
    cy.contains("Животные").should("be.visible");
    cy.contains("Еда").should("be.visible");
  });
});
