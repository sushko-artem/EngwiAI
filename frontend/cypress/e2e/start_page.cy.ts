describe("The start Page", () => {
  describe("unautorized user", () => {
    it("redirects to sign-in page", () => {
      cy.visit("/");
      cy.url().should("include", "/sign-in");
    });

    it("can navigate to sign/up when clicking on sign-up link", () => {
      cy.visit("/");
      cy.contains("Пройти регистрацию").click();
      cy.url().should("include", "/sign-up");
    });

    describe("autorized user", () => {
      beforeEach(() => {
        cy.resetDatabase();
      });

      it("redirects to /dashboard", () => {
        cy.loginNewUserWithSession();

        cy.visit("/");
        cy.url().should("include", "/dashboard");
        cy.contains("Модули").should("be.visible");
        cy.contains("Создать модуль").should("be.visible");

        cy.reload();

        cy.visit("/");
        cy.url().should("include", "/dashboard");
      });
    });
  });
});
