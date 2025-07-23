/* global describe, it, cy */
describe('Bug Tracker UI', () => {
  it('Visits home and adds a bug', () => {
    cy.visit('http://localhost:5173');
    cy.get('input[name="title"]').type('Sample Bug');
    cy.get('textarea[name="description"]').type('This is a sample bug');
    cy.get('button[type="submit"]').click();
    cy.contains('Sample Bug').should('be.visible');
  });
});
