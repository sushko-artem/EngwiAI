describe("CreateCollection - regression", () => {
  beforeEach(() => {
    cy.resetDatabase();
    cy.createAndLoginUser();
    cy.createCollection("animals");
    cy.visit("/create-collection");
  });

  it("should prevent saving collection with empty fields", () => {
    cy.get("[data-testid='rightIconAction']").click();
    cy.contains("Все поля должны быть заполнены!").should("be.visible");
    cy.get("img[alt='close']").click();
    cy.contains("Все поля должны быть заполнены!").should("not.exist");
    cy.url().should("include", "/create-collection");
  });

  it("should prevent saving empty collection", () => {
    cy.get("[data-testid='collection-name-input']").type("Фрукты");
    cy.get("[data-testid='deleteCross']").eq(1).click();
    cy.get("[data-testid='deleteCross']").eq(0).click();
    cy.get("[data-testid='rightIconAction']").click();
    cy.contains("Коллекция пустая! Добавьте карточку!").should("be.visible");
    cy.get("img[alt='close']").click();
    cy.contains("Коллекция пустая! Добавьте карточку!").should("not.exist");
    cy.url().should("include", "/create-collection");
  });

  it("should prevent navigation to /dashboard if collection has changes", () => {
    cy.get("[data-testid='collection-name-input']").type("Фрукты");
    cy.get("[data-testid='leftIconAction']").click();
    cy.contains("Все несохраненные данные будут потеряны!").should(
      "be.visible",
    );
    cy.get("img[alt='close']").click();
    cy.contains("Все несохраненные данные будут потеряны!").should("not.exist");
    cy.url().should("include", "/create-collection");
  });

  it("should navigate to /dashboard when collection has changes and action confirmed", () => {
    cy.get("[data-testid='word']").eq(0).type("Some value");
    cy.get("[data-testid='leftIconAction']").click();
    cy.contains("Все несохраненные данные будут потеряны!").should(
      "be.visible",
    );
    cy.get("img[alt='confirm']").click();
    cy.url().should("include", "/dashboard");
  });

  it("should prevent saving collection with existing name", () => {
    cy.get("[data-testid='collection-name-input']").type("Животные");
    cy.get("[data-testid='word']").eq(0).type("lion");
    cy.get("[data-testid='translation']").eq(0).type("Лев");
    cy.get("[data-testid='deleteCross']").eq(1).click();
    cy.get("[data-testid='rightIconAction']").click();
    cy.contains("Коллекция с таким именем уже существует!").should(
      "be.visible",
    );
  });
});
