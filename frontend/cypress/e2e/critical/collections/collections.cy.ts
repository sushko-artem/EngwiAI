describe("Collections Page - critical", () => {
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

  it("should display list of user collections", () => {
    cy.contains("Мои модули").should("be.visible");
    cy.fixture("collections/animals").then((animals) => {
      cy.contains(`${animals.name}`).should("be.visible");
    });
    cy.fixture("collections/food").then((food) => {
      cy.contains(`${food.name}`).should("be.visible");
    });
  });

  it("should navigate to flash-cards collection content when clicked", () => {
    cy.fixture("collections/animals").then((animals) => {
      cy.contains(`${animals.name}`).click();
    });
    cy.url().should("include", `/flash-cards/${collectionsIds[0]}`);
    cy.fixture("collections/animals").then((animals) => {
      cy.contains(`${animals.name}`).should("be.visible");
    });
    cy.contains("Флэш - карты").should("be.visible");
  });

  it("should navigate back to dashboard", () => {
    cy.get("[data-testid='leftIconAction']").click();
    cy.url().should("include", "/dashboard");
    cy.contains("EngwiAI").should("be.visible");
  });
});
