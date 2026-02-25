describe("Sign-up Page - critical", () => {
  beforeEach(() => {
    cy.resetDatabase();
  });

  it("should register new user and redirect to sign-in", () => {
    cy.visit("/sign-up");
    cy.contains("РЕГИСТРАЦИЯ").should("be.visible");
    cy.get("input[name='name']").type("John");
    cy.get("input[name='email']").type("test@mail.com");
    cy.get("input[name='password']").type("password123");
    cy.get("input[name='confirmPassword']").type("password123");
    cy.get("button[type=submit]").click();
    cy.url().should("include", "/sign-in");
    cy.contains("ВХОД").should("be.visible");
  });
});
