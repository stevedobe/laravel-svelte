import { pageTitle } from './../helpers';

describe('Create New Team', () => {
    const env = Cypress.env();

    context('Feature Check', () => {
        it('does not render the page if the feature is disabled', () => {
            if (!env.features.teams) {
                cy.login();

                cy.request({
                    url: '/teams/create',
                    failOnStatusCode: false,
                }).then((response) => {
                    expect(response.status).to.eq(404);
                });
            }
        });
    });

    if (!env.features.teams) {
        return;
    }

    context('Permissions', () => {
        it('forbids guests', () => {
            cy.logout().visit('/teams/create');

            cy.location('pathname').should('eq', '/login');
        });

        it('allows authorised users', () => {
            cy.login().visit('/teams/create');

            cy.location('pathname').should('eq', '/teams/create');
        });
    });

    context('The Page', () => {
        it('has the correct title', () => {
            cy.login().visit('/teams/create');

            cy.title().should('eq', pageTitle('Create Team'));
        });

        it('creates a team', () => {
            cy.login().visit('/teams/create');

            cy.contains('Team Details');

            cy.get('#name').clear();
            cy.get('#name').type('My New Team');

            cy.getByTestId('create-button').click();

            cy.location('pathname').should('eq', '/dashboard');

            cy.getByTestId('user-menu').filter(':visible').click();

            cy.contains('My New Team');
        });
    });
});
