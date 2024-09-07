import { pageTitle } from './helpers';

describe('Welcome', () => {
    context('Permissions', () => {
        it('allows guests', () => {
            cy.logout().visit('/');

            cy.location('pathname').should('eq', '/');
        });

        it('allows users', () => {
            cy.login().visit('/');

            cy.location('pathname').should('eq', '/');
        });
    });

    context('The Page', () => {
        const env = Cypress.env();

        before(() => {
            cy.logout();
        });

        beforeEach(() => {
            cy.visit('/');
        });

        it('has the correct title', () => {
            cy.title().should('eq', pageTitle('Welcome'));
        });

        it('has a link to the Log in page', () => {
            cy.contains('Log in').click();

            cy.location('pathname').should('eq', '/login');
        });

        it('has a link to the Register page if feature is enabled', () => {
            if (!env.features.registration) {
                cy.contains('Register').should('not.exist');

                return;
            }

            cy.contains('Register').click();

            cy.location('pathname').should('eq', '/register');
        });
    });
});
