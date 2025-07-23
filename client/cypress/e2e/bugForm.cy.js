/// <reference types="cypress" />

describe("Bug Form", () => {
  it("submits a bug", () => {
    cy.visit("http://localhost:5173");
    cy.get("#title").type("Test bug");
    cy.get("#description").type("Bug description");
    cy.get("form").submit();
    cy.contains("Test bug");
  });
});
