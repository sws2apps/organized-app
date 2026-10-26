/// <reference types="cypress" />

// Run against a TEST-mode server: cypress run --spec cypress/e2e/preaching_partner.cy.ts
// --config baseUrl=http://localhost:4061
const button = (label: string) =>
  cy.contains('button, [role="button"]', new RegExp(label, 'i'));
const myTab = '#preaching-partner-tab-my-requests';
const congregationTab = '#preaching-partner-tab-congregation-requests';

describe('Find a partner demo', { testIsolation: false }, () => {
  before(() => {
    cy.viewport(1280, 900);
    cy.visit('/');
    button('START TESTING').should('be.visible').click();
    button('OK').should('be.visible').click();
    button('Find a partner · Demo').click();
    cy.contains('Demo only.').should('be.visible');
  });

  it('creates, edits, protects a draft, and deletes a request', () => {
    button('New request').click();
    cy.get('input')
      .filter('[type="text"]')
      .last()
      .type('Partner review request');
    button('CREATE').click();
    cy.contains('Partner review request').should('be.visible');
    cy.get('button[aria-label^="Edit:"]').first().click();
    cy.get('input')
      .filter('[type="text"]')
      .last()
      .clear()
      .type('Unsaved replacement');
    cy.get('button[aria-label="Close"]').click();
    cy.contains('You have unsaved changes').should('be.visible');
    button('Discard changes').click();
    cy.contains('Partner review request').should('be.visible');
    cy.get('button[aria-label^="Edit:"]').first().click();
    cy.get('input')
      .filter('[type="text"]')
      .last()
      .clear()
      .type('Edited review request');
    button('SAVE').click();
    cy.contains('Edited review request').should('be.visible');
    cy.get('button[aria-label^="Edit:"]').first().click();
    button('DELETE').click();
    cy.get('[role="dialog"]')
      .last()
      .contains('button', /^delete$/i)
      .click();
    cy.contains('Edited review request').should('not.exist');
  });

  it('moves keyboard focus with desktop tabs and exposes filter state', () => {
    cy.get(myTab).focus().trigger('keydown', { key: 'ArrowDown' });
    cy.get(congregationTab)
      .should('have.attr', 'aria-selected', 'true')
      .and('have.focus');
    cy.contains('button', /^Zoom$/)
      .click()
      .should('have.attr', 'aria-pressed', 'true');
    cy.contains('button', /^All$/).should('have.attr', 'aria-pressed', 'false');
    cy.contains('button', /^All$/).click();
  });

  it('joins, offers calendar export again, and reopens a cancelled arrangement', () => {
    cy.get('button[aria-label^="Join:"]').first().click();
    button('CONFIRM').click();
    cy.contains('Download this demo arrangement').should('be.visible');
    button('NO, THANKS').click();
    cy.get(myTab).click();
    cy.contains('Arranged').should('be.visible');
    button('Add to calendar').click();
    button('NO, THANKS').click();
    cy.get('button[aria-label^="Cancel:"]').first().click();
    button('Cancel the arrangement').click();
    cy.contains('Arranged').should('not.exist');
  });

  it('uses mobile subpages without horizontal overflow and returns to the list', () => {
    cy.viewport(390, 844);
    cy.get('[role="tablist"]').should('not.exist');
    cy.get('button[aria-label="Back"]').click();
    cy.get(congregationTab).should('not.have.attr', 'role', 'tab').click();
    cy.contains('Filters').should('be.visible');
    cy.document().should((document) =>
      expect(document.documentElement.scrollWidth).to.be.at.most(
        document.documentElement.clientWidth
      )
    );
    cy.contains('The request is available again in this demo.').should(
      'not.exist'
    );
    cy.viewport(375, 812);
    cy.document().should((document) =>
      expect(document.documentElement.scrollWidth).to.be.at.most(
        document.documentElement.clientWidth
      )
    );
    cy.screenshot('partner-mobile', { capture: 'viewport' });
    cy.viewport(844, 390);
    cy.document().should((document) =>
      expect(document.documentElement.scrollWidth).to.be.at.most(
        document.documentElement.clientWidth
      )
    );
    cy.viewport(390, 844);
    cy.get('button[aria-label="Back"]').click();
    cy.get(myTab).should('be.visible');
    cy.get('button[aria-label="Back"]').click();
    cy.get('input[type="checkbox"]').check();
    button('Find a partner · Demo').click();
    cy.get(congregationTab).click();
    cy.contains('Filters').should('be.visible');
    cy.screenshot('partner-mobile-dark', { capture: 'viewport' });
  });
});
