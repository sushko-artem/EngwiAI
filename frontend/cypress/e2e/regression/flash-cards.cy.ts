describe("FlashCards - regression", () => {
  let collectionId: string;
  beforeEach(() => {
    cy.resetDatabase();
    cy.createAndLoginUser();
    cy.fixture("collections/animals").as("animals");
    cy.fixture("collections/food").as("food");
    cy.createCollection("food");
    cy.createCollection("animals").then((animals) => {
      collectionId = animals.id;
      cy.visit(`/flash-cards/${collectionId}`);
    });
  });

  it("should reverse card when clicking on it", function () {
    cy.get("[data-testid='word-side']").should("be.visible");
    cy.get("[data-testid='flash-card']").click();
    cy.get("[data-testid='word-side']").should("not.be.visible");
    cy.get("[data-testid='translation-side']").should("be.visible");
  });

  it("should update both card and progress when navigating to next card", function () {
    cy.get("[data-testid='word-side']").invoke("text").as("firstWord");

    cy.get("@firstWord").then((firstWord) => {
      cy.get("[data-testid='chosen-status-button']").first().click();
      cy.get("[data-testid='word-side']").should("not.have.text", firstWord);
    });
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

    const translations = this.animals.cards.map(
      (c: { word: string; translation: string }) => c.translation,
    );
    cy.get("[data-testid='word-side']").should(($el) => {
      const text = $el.text();
      expect(translations).to.include(text);
    });
  });

  it("should delete collection when clicked delete button in option menu and confirmed action", function () {
    cy.get("[data-testid='rightIconAction']").click();
    cy.get("[data-testid='menu-options-delete']").click();
    cy.get("[data-testid='modal-view']").should("be.visible");
    cy.get("img[alt='confirm']").click();
    cy.url().should("include", "/collections");
    cy.contains(this.animals.name).should("not.exist");
    cy.contains(this.food.name).should("be.visible");
  });

  it("should prevent deleting when clicked delete button in option menu and cancelled action", function () {
    cy.get("[data-testid='rightIconAction']").click();
    cy.get("[data-testid='menu-options-delete']").click();
    cy.get("[data-testid='modal-view']").should("be.visible");
    cy.get("img[alt='close']").click();
    cy.url().should("include", `/flash-cards/${collectionId}`);
    cy.contains(this.animals.name).should("be.visible");
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
    cy.contains(`Знаю: ${this.animals.cards.length}`).should("be.visible");
    cy.contains("Изучил: 0").should("be.visible");
  });
});
