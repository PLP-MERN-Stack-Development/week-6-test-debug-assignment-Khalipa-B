describe("Create Bug Form", () => {
  it("submits bug when form is filled", () => {
    cy.visit("http://localhost:5173"); // update if your frontend runs on a different port
    cy.get("input[name='title']").type("Test Bug");
    cy.get("textarea[name='description']").type("Bug description goes here");
    cy.get("select[name='priority']").select("medium");
    cy.get("button[type='submit']").click();
    cy.contains("Bug submitted successfully").should("exist");
  });
});
