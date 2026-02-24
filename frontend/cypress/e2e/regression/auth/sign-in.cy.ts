describe("Sign-in Page - regression", () => {
  beforeEach(() => {
    cy.resetDatabase();
  });

  it("should show validation errors when submitting empty form", () => {
    cy.visit("/sign-in");
    cy.get("button[type=submit]").click();
    cy.contains("Обязательно для заполнения").should("be.visible");
    cy.get("button[type=submit]").should("be.disabled");
  });

  it("should show validation error when email incorrect", () => {
    const existingEmail = `test-${Date.now()}@mail.com`;
    cy.visit("sign-in");
    cy.createUser({
      email: existingEmail,
    });
    cy.get("input[name='email']").type("testmail@mail.com");
    cy.get("input[name='password']").type("password123");
    cy.get("button[type=submit]").click();
    cy.contains("Не верно указан email").should("be.visible");
    cy.get("button[type=submit]").should("be.disabled");
  });

  it("should show validation error when password incorrect", () => {
    const existingEmail = `test-${Date.now()}@mail.com`;
    cy.visit("sign-in");
    cy.createUser({
      email: existingEmail,
    });
    cy.get("input[name='email']").type(existingEmail);
    cy.get("input[name='password']").type("password12");
    cy.get("button[type=submit]").click();
    cy.contains("Не верно указан пароль").should("be.visible");
    cy.get("button[type=submit]").should("be.disabled");
  });
});
