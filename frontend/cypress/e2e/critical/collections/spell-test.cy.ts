import { ICard } from "@shared/api";

describe("SpellTestPage - critical", () => {
  beforeEach(() => {
    cy.resetDatabase();
    cy.createAndLoginUser();
    cy.createCollection("animals");
    cy.fixture("collections/animals").as("animals");
    cy.visit("/spell-check");
    cy.get("[data-testid='chosen-module']").click();
    cy.get("[data-testid='translation']").click();
    cy.get("[data-testid='start-test']").click();
  });

  it("should complete full test with correct answers and see summary", function () {
    this.animals.cards.forEach((card: ICard) => {
      cy.get("[data-testid='user-answer-textarea']").type(card.word!);
      cy.get("[data-testid='spell-test-answer-button']").click();
    });
    cy.get("[data-testid='spell-test-modal']").should("be.visible");
    cy.contains("100%").should("be.visible");
    cy.get("[data-testid='modal-action']").should("have.length", 2);
  });

  it("should validate answer and track mistakes", function () {
    cy.get("[data-testid='user-answer-textarea']").type("wrong answer");
    cy.get("[data-testid='spell-test-answer-button']").click();

    cy.contains(this.animals.cards[1].translation).should("be.visible");

    cy.contains(`2/${this.animals.cards.length}`).should("be.visible");

    this.animals.cards.slice(1).forEach((card: ICard) => {
      cy.get("[data-testid='user-answer-textarea']").type(card.word!);
      cy.get("[data-testid='spell-test-answer-button']").click();
    });
    cy.get("[data-testid='spell-test-modal']").should("be.visible");
    cy.get("[data-testid='modal-action']").should("have.length", 3);
  });

  it("should navigate from start to finish and back to module selection", function () {
    this.animals.cards.forEach((card: ICard) => {
      cy.get("[data-testid='user-answer-textarea']").type(card.word!);
      cy.get("[data-testid='spell-test-answer-button']").click();
    });
    cy.get("[data-testid='modal-action']").eq(1).click();
    cy.url().should("include", "/spell-check");
  });

  it("should navigate from start to finish and reset", function () {
    this.animals.cards.forEach((card: ICard) => {
      cy.get("[data-testid='user-answer-textarea']").type(card.word!);
      cy.get("[data-testid='spell-test-answer-button']").click();
    });
    cy.get("[data-testid='modal-action']").eq(0).click();
    cy.contains(this.animals.cards[0].translation).should("be.visible");
  });

  it("should navigate from start to finish and navigate to /test-report", function () {
    cy.get("[data-testid='user-answer-textarea']").type("wrong answer");
    cy.get("[data-testid='spell-test-answer-button']").click();
    this.animals.cards.slice(1).forEach((card: ICard) => {
      cy.get("[data-testid='user-answer-textarea']").type(card.word!);
      cy.get("[data-testid='spell-test-answer-button']").click();
    });
    cy.get("[data-testid='modal-action']").eq(0).click();
    cy.url().should("include", "/test-report");
  });
});
