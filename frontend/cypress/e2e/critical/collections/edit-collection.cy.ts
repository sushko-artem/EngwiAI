describe("EditCollection - critical", () => {
  let collectionId: string;
  beforeEach(() => {
    cy.resetDatabase();
    cy.createAndLoginUser();
    cy.createCollection("animals").then((collection) => {
      collectionId = collection.id;
      cy.visit(`/edit-collection/${collection.id}`);
    });
  });

  it("should render correct collection", () => {
    cy.contains("Редактирование").should("be.visible");
    cy.url().should("include", `/edit-collection/${collectionId}`);
    cy.fixture("collections/animals").then((animals) => {
      cy.get("[data-testid='collection-name-input']").should(
        "have.value",
        `${animals.name}`,
      );
    });
  });

  it("should save edited collection", () => {
    cy.get("[data-testid='collection-name-input']").clear();
    cy.get("[data-testid='collection-name-input']").type("Звери");
    cy.get("[data-testid='add-card-button']").click();
    cy.get("[data-testid='word']").eq(-1).type("Lion");
    cy.get("[data-testid='translation']").eq(-1).type("Лев");
    cy.get("[data-testid='rightIconAction']").click();
    cy.url().should("include", "/collections");
    cy.contains("Звери").should("be.visible");
    cy.fixture("collections/animals").then((animals) => {
      cy.contains(`${animals.name}`).should("not.exist");
    });
  });
});
