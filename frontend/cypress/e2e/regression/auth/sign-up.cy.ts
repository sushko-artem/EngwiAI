describe("Sign-up Page - regression", () => {
  beforeEach(() => {
    cy.resetDatabase();
  });

  it("should navigate to sign/in when clicking on sign-in link", () => {
    cy.visit("/sign-up");
    cy.contains("Уже регистрировались ранее?").click();
    cy.url().should("include", "/sign-in");
    cy.contains("ВХОД").should("be.visible");
  });

  it("should show error for existing email", () => {
    const existingEmail = `test-${Date.now()}@mail.com`;
    cy.visit("/sign-up");
    cy.createUser({
      email: existingEmail,
    });
    cy.get("input[name='name']").type("John");
    cy.get("input[name='email']").type(existingEmail);
    cy.get("input[name='password']").type("password123");
    cy.get("input[name='confirmPassword']").type("password123");
    cy.get("button[type=submit]").click();
    cy.get("[data-testid='email-error']")
      .should("be.visible")
      .and("have.text", "Пользователь с таким email уже существует");
    cy.get("button[type=submit]").should("be.disabled");
    cy.url().should("include", "/sign-up");
  });
});
