describe("GrammarCheckPage - critical", () => {
  beforeEach(() => {
    cy.resetDatabase();
    cy.createAndLoginUser();
    cy.createCollection("animals");
    cy.createCollection("food");
    cy.fixture("collections/food").as("food");
    cy.fixture("collections/animals").as("animals");
    cy.fixture("grammar-test-data").as("mockedResponseData");
    cy.visit("/grammar-check");
  });

  it("should render correct data and UI", function () {
    cy.url().should("include", "/grammar-check");
    cy.contains(this.animals.name).should("be.visible");
    cy.contains(this.food.name).should("be.visible");
    cy.get("[data-testid='word']").should("be.visible");
    cy.get("[data-testid='translation']").should("be.visible");
    cy.get("[data-testid='beginner']").should("be.visible");
    cy.get("[data-testid='intermediate']").should("be.visible");
    cy.get("[data-testid='advanced']").should("be.visible");
    cy.get("[data-testid='5_tenses']").should("be.visible");
    cy.get("[data-testid='7_tenses']").should("be.visible");
    cy.get("[data-testid='10_tenses']").should("be.visible");
    cy.get("[data-testid='start-test']").should("be.visible");
  });

  it("should show warning modal when clicking on start test button and no chosen module", function () {
    cy.get("[data-testid='start-test']").click();
    cy.get("[data-testid='modal-view']").should("be.visible");
  });

  it("should select only one module", function () {
    cy.get("[data-testid='chosen-module']")
      .first()
      .should("have.attr", "data-state", "unchosen");
    cy.contains(this.animals.name).click();
    cy.get("[data-testid='chosen-module']")
      .first()
      .should("have.attr", "data-state", "chosen");
    cy.contains(this.food.name).click();
    cy.get("[data-testid='chosen-module']")
      .first()
      .should("have.attr", "data-state", "unchosen");
  });

  it("should navigate to dashboard page when clicking on back", () => {
    cy.get("[data-testid='leftIconAction']").click();
    cy.url().should("include", "/dashboard");
  });

  it("should navigate to grammar-test page when clicking on start test button and module is chosen", function () {
    cy.intercept("POST", "/api/ai/generate-sentences", {
      statusCode: 200,
      fixture: "grammar-test-data.json",
    }).as("generateSentences");
    cy.contains(this.animals.name).click();
    cy.get("[data-testid='start-test']").click();
    cy.wait("@generateSentences");
    cy.url().should("include", "/grammar-test");
    cy.contains(this.mockedResponseData.sentences[0].translation).should(
      "be.visible",
    );
  });

  it("should block start button and restore timer on return", function () {
    cy.intercept("POST", "/api/ai/generate-sentences", {
      statusCode: 200,
      fixture: "grammar-test-data.json",
    }).as("generateSentences");
    cy.contains(this.animals.name).click();
    cy.get("[data-testid='start-test']").click();
    cy.wait("@generateSentences");
    cy.url().should("include", "/grammar-test");
    cy.go("back");
    cy.url().should("include", "/grammar-check");
    cy.get("[data-testid='start-test']").should("be.disabled");
    cy.contains(/Следующая попытка через/).should("be.visible");
  });
});
