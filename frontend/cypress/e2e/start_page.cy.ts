describe("The start Page", () => {
  it("redirects to sign-in", () => {
    cy.visit("/");
    cy.url({ timeout: 10000 }).should("include", "/sign-in");
  });
});
