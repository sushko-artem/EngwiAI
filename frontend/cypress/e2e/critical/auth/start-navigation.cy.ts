describe("Start Page - critical", () => {
  describe("unautorized user", () => {
    it("redirects to sign-in page", () => {
      cy.visit("/");
      cy.url().should("include", "/sign-in");
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

        cy.visit("/");
        cy.url().should("include", "/dashboard");
      });
    });
  });
});
