describe("SpellCheckPage - critical", () => {
  beforeEach(() => {
    cy.resetDatabase();
    cy.createAndLoginUser();
    cy.createCollection("animals");
    cy.createCollection("food");
    cy.fixture("collections/food").as("food");
    cy.fixture("collections/animals").as("animals");
    cy.visit("/spell-check");
  });

  it("should render correct collections list and UI", function () {
    cy.url().should("include", "/spell-check");
    cy.contains(this.animals.name).should("be.visible");
    cy.contains(this.food.name).should("be.visible");
    cy.get("[data-testid='word']").should("be.visible");
    cy.get("[data-testid='translation']").should("be.visible");
    cy.get("[data-testid='start-test']").should("be.visible");
  });

  it("should select chosen module", function () {
    cy.get("[data-testid='chosen-module']")
      .first()
      .should("have.attr", "data-state", "unchosen");
    cy.contains(this.animals.name).click();
    cy.get("[data-testid='chosen-module']")
      .first()
      .should("have.attr", "data-state", "chosen");
    cy.contains(this.animals.name).click();
    cy.get("[data-testid='chosen-module']")
      .first()
      .should("have.attr", "data-state", "unchosen");
  });

  it("should allow choose multiple modules", function () {
    cy.contains(this.animals.name).click();
    cy.contains(this.food.name).click();
    cy.get("[data-testid='chosen-module']").each(($el) => {
      cy.wrap($el).should("have.attr", "data-state", "chosen");
    });
  });

  it("should navigate to spell-check/test page when click on start", function () {
    cy.contains(this.animals.name).click();
    cy.get("[data-testid='start-test']").click();
    cy.url().should("include", "spell-check/test");
  });
});
