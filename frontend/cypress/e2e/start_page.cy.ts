describe("The start Page", () => {
  it("successfully loads", () => {
    cy.visit("/");
    cy.url().should("include", "/sign-in");
  });
});
