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
    cy.contains("Животные").should("be.visible");
    cy.contains("Еда").should("be.visible");
  });

  it("should navigate to flash-cards collection content when clicked", () => {
    cy.contains("Животные").click();
    cy.url().should("include", `/flash-cards/${collectionsIds[0]}`);
    cy.contains("Животные").should("be.visible");
    cy.contains("Флэш - карты").should("be.visible");
  });

  it("should navigate back to dashboard", () => {
    cy.get("[data-testid='leftIconAction']").click();
    cy.url().should("include", "/dashboard");
    cy.contains("EngwiAI").should("be.visible");
  });
});
