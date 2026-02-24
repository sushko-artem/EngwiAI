describe("Sign-in Page - critical", () => {
  beforeEach(() => {
    cy.resetDatabase();
  });

  it("should login and redirect to dashboard", () => {
    const existingEmail = `test-${Date.now()}@mail.com`;
    cy.visit("/sign-in");
    cy.createUser({
      email: existingEmail,
    });
    cy.get("input[name='email']").type(existingEmail);
    cy.get("input[name='password']").type("password123");
    cy.get("button[type=submit]").click();
    cy.url().should("include", "/dashboard");
    cy.contains("EngwiAI").should("be.visible");
  });
});
