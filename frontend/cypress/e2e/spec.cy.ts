describe("My First Test", () => {
  it("Click the link type", () => {
    cy.visit("https://example.cypress.io");
    cy.contains("type").click();
    cy.url().should("include", "/commands/actions");
    cy.fixture("example").then((data) => {
      cy.get(".action-email").type(data.email);
      cy.get(".action-email").should("have.value", data.email);
    });
  });
});
