describe("FlashCards - regression", () => {
  beforeEach(() => {
    cy.resetDatabase();
    cy.createAndLoginUser();
    cy.fixture("collections/animals").as("animals");
    cy.createCollection("animals").then((animals) => {
      cy.visit(`/flash-cards/${animals.id}`);
    });
  });

  it("should reverse card when clicking on it", function () {
    cy.contains(this.animals.cards[0].word).should("be.visible");
    cy.get("[data-testid='flash-card']").click();
    cy.contains(this.animals.cards[0].word).should("not.be.visible");
    cy.contains(this.animals.cards[0].translation).should("be.visible");
  });

  it("should update both card and progress when navigating to next card", function () {
    cy.get("[data-testid='chosen-status-button']").eq(0).click();
    cy.contains(this.animals.cards[1].word).should("be.visible");
    cy.contains(`2/${this.animals.cards.length}`).should("be.visible");
  });

  it("should open options menu with overlay when clicking on options button", () => {
    cy.get("[data-testid='menu-options']").should("not.exist");
    cy.get("[data-testid='rightIconAction']").click();
    cy.get("[data-testid='menu-overlay']").should("be.visible");
    cy.get("[data-testid='menu-options']").should("be.visible");
    cy.get("button[role='switch']").should("be.visible");
    cy.get("[data-testid='menu-options-edit']").should("be.visible");
    cy.get("[data-testid='menu-options-delete']").should("be.visible");
  });

  it("should close menu when clicking outside", () => {
    cy.get("[data-testid='rightIconAction']").click();
    cy.get("[data-testid='menu-options']").should("be.visible");
    cy.get("[data-testid='menu-overlay']").click("center");
    cy.get("[data-testid='menu-options']").should("not.exist");
  });

  it("should switch cards when clicking on switch button in options menu", function () {
    cy.get("[data-testid='rightIconAction']").click();
    cy.get("button[role='switch']").click();
    cy.get("[data-testid='menu-options']").should("be.visible");
    cy.get("[data-testid='menu-overlay']").click("center");
    cy.contains(this.animals.cards[0].translation).should("be.visible");
  });

  it("should open flash-modal when all cards was shown", function () {
    for (let i = 0; i < this.animals.cards.length; i++) {
      cy.get("[data-testid='chosen-status-button']").eq(0).click();
    }
    cy.get("[data-testid='flash-modal']").should("be.visible");
    cy.contains(`Модуль "${this.animals.name}" пройден!`);
  });

  it("should show right progress on summary", function () {
    for (let i = 0; i < this.animals.cards.length; i++) {
      cy.get("[data-testid='chosen-status-button']").eq(1).click();
    }
    cy.contains("Прогресс: 100%").should("be.visible");
    cy.contains("Знаю: 4").should("be.visible");
    cy.contains("Изучил: 0").should("be.visible");
  });
});
