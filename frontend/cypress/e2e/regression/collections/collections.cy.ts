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
    cy.get("[data-testid='deleteCross']").eq(0).click();
    cy.contains("Удалить коллекцию Животные?").should("be.visible");
    cy.get("img[alt='confirm']").click();
    cy.fixture("collections/animals").then((animals) => {
      cy.contains(`${animals.name}`).should("not.exist");
    });
    cy.fixture("collections/food").then((food) => {
      cy.contains(`${food.name}`).should("be.visible");
    });
  });

  it("should cancel deletion", () => {
    cy.get("[data-testid='deleteCross']").eq(1).click();
    cy.contains("Удалить коллекцию Еда?").should("be.visible");
    cy.get("img[alt='close']").click();
    cy.fixture("collections/animals").then((animals) => {
      cy.contains(`${animals.name}`).should("be.visible");
    });
    cy.fixture("collections/food").then((food) => {
      cy.contains(`${food.name}`).should("be.visible");
    });
  });
});
