describe("GrammarTestPage - smoke", () => {
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

  it("should navigate to /grammar-check", () => {
    cy.get("[data-testid='leftIconAction']").click();
    cy.url().should("include", "/grammar-check");
  });

  it("should render correctly", function () {
    const sentences = this.mockedResponseData.sentences;
    cy.contains(sentences[0].translation).should("be.visible");
    cy.contains(`1/${sentences.length}`).should("be.visible");
    cy.get("[data-testid='grammar-test-answer-button']").should("be.visible");
  });

  it("should reset test when open menu options and click reset", function () {
    const sentences = this.mockedResponseData.sentences;
    cy.get("[data-testid='grammar-test-answer-button']").click();
    cy.contains(sentences[0].translation).should("not.exist");
    cy.contains(`2/${sentences.length}`).should("be.visible");
    cy.get("[data-testid='rightIconAction']").click();
    cy.get("[data-testid='menu-options-reset']").click();
    cy.contains(sentences[0].translation).should("be.visible");
  });
});
