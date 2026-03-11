describe("Sign-in Page - smoke", () => {
  it("can navigate to sign/up when clicking on sign-up link", () => {
    cy.visit("/sign-in");
    cy.get("body").should("be.visible");
    cy.wait(2000);
    cy.contains("Пройти регистрацию").click();
    cy.url().should("include", "/sign-up");
    cy.contains("РЕГИСТРАЦИЯ").should("be.visible");
  });
});
