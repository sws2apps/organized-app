describe('Testing Home Page', () => {
	describe('Testing Startup Page', () => {
		beforeEach(() => {
			cy.visit('/');
		});

		it('Open the Terms of Use landing page', () => {
			cy.wait(3000);
			cy.get('#dlg-terms-use').should('exist');
			cy.get('#checkContinue').should('exist');
			cy.get('#appLanguage').should('exist');
		});
	});
});
