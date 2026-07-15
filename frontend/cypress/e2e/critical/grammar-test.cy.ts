describe("GrammarTestPage - critical", () => {
  beforeEach(() => {
    cy.resetDatabase();
    cy.createAndLoginUser();
    cy.createCollection("animals");
    cy.createCollection("food");
    cy.fixture("collections/food").as("food");
    cy.fixture("collections/animals").as("animals");
    cy.fixture("grammar-test-data").as("mockedResponseData");
    cy.fixture("grammar-test-data").then((data) => {
      cy.intercept("POST", "/api/ai/generate-sentences", {
        statusCode: 200,
        body: data,
      }).as("generateSentences");
    });
    cy.visit("/grammar-check");
    cy.get("[data-testid='chosen-module']").first().click();
    cy.get("[data-testid='start-test']").click();
    cy.wait("@generateSentences");
  });

  it("should update sentense, index, translation after clicking on answer-button", function () {
    const sentences = this.mockedResponseData.sentences;
    cy.get("[data-testid='sortable-item']").should("have.length.at.least", 2);
    let startTranslation: string, startShuffledWords: string;
    cy.get("[data-testid='test-translation']")
      .invoke("text")
      .then((text) => {
        startTranslation = text;
      });
    cy.get("[data-testid='sortable-item']")
      .first()
      .invoke("text")
      .then((text) => {
        startShuffledWords = text;
      });
    cy.get("[data-testid='grammar-test-answer-button']").click();
    cy.contains(`2/${sentences.length}`).should("be.visible");
    cy.get("[data-testid='test-translation']")
      .invoke("text")
      .then((text) => {
        expect(text).not.to.equal(startTranslation);
      });
    cy.get("[data-testid='sortable-item']")
      .first()
      .invoke("text")
      .then((text) => {
        expect(text).not.to.equal(startShuffledWords);
      });
    for (let i = 0; i < sentences.length - 1; i++) {
      cy.get("[data-testid='grammar-test-answer-button']").click();
    }
  });

  it("should complete full test and see summary", function () {
    const length = this.mockedResponseData.sentences.length;
    for (let i = 0; i < length; i++) {
      cy.get("[data-testid='grammar-test-answer-button']").click();
    }
    cy.get("[data-testid='test-modal']").should("be.visible");
  });

  it("should complete full test and see summary and navigate to mistakes test-report", function () {
    const sentences = this.mockedResponseData.sentences;
    for (let i = 0; i < sentences.length; i++) {
      cy.get("[data-testid='grammar-test-answer-button']").click();
    }
    cy.get("[data-testid='test-modal']").should("be.visible");
    cy.get("[data-testid='modal-action']").first().click();
    cy.url().should("contain", "/test-report");
  });

  it("should complete full test and see summary and reset", function () {
    const sentences = this.mockedResponseData.sentences;
    for (let i = 0; i < sentences.length; i++) {
      cy.get("[data-testid='grammar-test-answer-button']").click();
    }
    cy.get("[data-testid='test-modal']").should("be.visible");
    cy.get("[data-testid='modal-action']").eq(1).click();
    cy.contains(sentences[0].translation).should("be.visible");
  });

  it("should complete full test and see summary and navigate to /grammar-check", function () {
    const sentences = this.mockedResponseData.sentences;
    for (let i = 0; i < sentences.length; i++) {
      cy.get("[data-testid='grammar-test-answer-button']").click();
    }
    cy.get("[data-testid='test-modal']").should("be.visible");
    cy.get("[data-testid='modal-action']").eq(2).click();
    cy.url().should("contain", "/grammar-check");
  });
});
