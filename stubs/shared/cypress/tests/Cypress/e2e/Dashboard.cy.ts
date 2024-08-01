describe('Dashboard', () => {
    context('Permissions', () => {
        it('redirects guests to the Log in page', () => {
            cy.logout().visit('/dashboard');

            cy.location('pathname').should('eq', '/login');
        });

        it('allows users', () => {
            cy.login().visit('/dashboard');

            cy.location('pathname').should('eq', '/dashboard');
        });
    });

    context('The Page', () => {
        it('has the correct title', () => {
            cy.login().visit('/dashboard');

            cy.title().should('eq', `Dashboard | ${Cypress.env('appName')}`);
        });
    });
});
