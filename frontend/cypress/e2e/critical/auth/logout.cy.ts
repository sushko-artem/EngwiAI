describe("Logging out - critical", () => {
  beforeEach(() => {
    cy.resetDatabase();
    cy.createAndLoginUser();
  });

  it("should show confirm modal when clicking on logOut", () => {
    cy.visit("/dashboard");
    cy.get("button[data-testid='rightIconAction']").click();
    cy.get("[data-testid='modal-view']").should("be.visible");
  });

  it("should logged out when clicking LogOut and confirm", () => {
    cy.visit("/dashboard");
    cy.get("button[data-testid='rightIconAction']").click();
    cy.get("img[alt='confirm']").click();
    cy.url().should("include", "/sign-in");
  });
  it("should prevent logging out when clicking LogOut and deny", () => {
    cy.visit("/dashboard");
    cy.get("button[data-testid='rightIconAction']").click();
    cy.get("img[alt='close']").click();
    cy.url().should("include", "/dashboard");
  });
});
