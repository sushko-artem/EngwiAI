import { actions as dashboardActions } from "@features/dashboard/lib";
describe("Dashboard - critical", () => {
  beforeEach(() => {
    cy.resetDatabase();
    cy.createAndLoginUser();
    cy.visit("/dashboard");
  });

  it("should load dashboard for authenticated user", () => {
    cy.contains(dashboardActions[0].title).should("be.visible");
    cy.contains(dashboardActions[1].title).should("be.visible");
    cy.contains(dashboardActions[2].title).should("be.visible");
  });

  it("should have working navigation to modules", () => {
    cy.contains(dashboardActions[0].title).click();
    cy.url().should("include", dashboardActions[0].url);
  });

  it("should have working navigation to create-collection page", () => {
    cy.contains(dashboardActions[1].title).click();
    cy.url().should("include", dashboardActions[1].url);
  });

  it("should have working navigation to interval-learning page", () => {
    cy.contains(dashboardActions[2].title).click();
    cy.url().should("include", dashboardActions[2].url);
  });
});
