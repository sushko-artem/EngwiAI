describe("FlashCards - smoke", () => {
  let collecionId: string;
  beforeEach(() => {
    cy.resetDatabase();
    cy.createAndLoginUser();
    cy.fixture("collections/food").as("food");
    cy.fixture("collections/animals").as("animals");
    cy.createCollection("animals");
    cy.createCollection("food").then((food) => {
      collecionId = food.id;
      cy.visit(`flash-cards/${collecionId}`);
    });
  });

  it("should navigate to collection page when clicking back", function () {
    cy.get("[data-testid='leftIconAction']").click();
    cy.url().should("include", `/collections`);
    cy.contains(this.animals.name).should("be.visible");
    cy.contains(this.food.name).should("be.visible");
  });

  it("should navigate to edit collection page", function () {
    cy.get("[data-testid='rightIconAction']").click();
    cy.get("[data-testid='menu-options-edit']").click();
    cy.url().should("include", `/edit-collection/${collecionId}`);
    cy.get("[data-testid='collection-name-input']").should(
      "have.value",
      this.food.name,
    );
  });

  describe("from actions in flash modal", () => {
    beforeEach(function () {
      for (let i = 0; i < this.food.cards.length; i++) {
        cy.get("[data-testid='chosen-status-button']").eq(1).click();
      }
    });

    it("should reset module when reset button clicked", function () {
      cy.get("[data-testid='flash-modal-actions-container']")
        .children()
        .eq(0)
        .click();
      cy.url().should("include", `/flash-cards/${collecionId}`);
      cy.contains(this.food.name).should("be.visible");
      cy.contains(`1/${this.food.cards.length}`).should("be.visible");
    });

    it("should navigate to edit page", function () {
      cy.get("[data-testid='flash-modal-actions-container']")
        .children()
        .eq(1)
        .click();
      cy.url().should("include", `/edit-collection/${collecionId}`);
      cy.get("[data-testid='collection-name-input']").should(
        "have.value",
        this.food.name,
      );
    });

    it("should navigate to /collections page", function () {
      cy.get("[data-testid='flash-modal-actions-container']")
        .children()
        .eq(2)
        .click();
      cy.url().should("include", `/collections`);
      cy.contains(this.animals.name).should("be.visible");
      cy.contains(this.food.name).should("be.visible");
    });
  });
});
