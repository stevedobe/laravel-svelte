import { pageTitle } from './../helpers';

function createToken(tokenName: string): void {
    cy.get('#name').clear();
    cy.get('#name').type(tokenName);
    cy.getByTestId('create-button').click();
    cy.getByTestId('close-api-token').click();
}

describe('API Tokens', () => {
    const env = Cypress.env();

    context('Feature Check', () => {
        it('does not render the page if the feature is disabled', () => {
            if (!env.features.api) {
                cy.login();

                cy.request({
                    url: '/user/api-tokens',
                    failOnStatusCode: false,
                }).then((response) => {
                    expect(response.status).to.eq(404);
                });
            }
        });
    });

    if (!env.features.api) {
        return;
    }

    context('Permissions', () => {
        it('forbids guests', () => {
            cy.logout().visit('/user/api-tokens');

            cy.location('pathname').should('eq', '/login');
        });

        it('allows authorised users', () => {
            cy.login().visit('/user/api-tokens');

            cy.location('pathname').should('eq', '/user/api-tokens');
        });
    });

    context('The Page', () => {
        beforeEach(() => {
            cy.login().visit('/user/api-tokens');
        });

        it('has the correct title', () => {
            cy.title().should('eq', pageTitle('API Tokens'));
        });

        it('creates a token', () => {
            cy.contains('Create API Token');

            cy.get('#name').clear();
            cy.get('#name').type('A Token');
            cy.get('#update').check();

            cy.getByTestId('create-button').click();
            cy.contains('Created.');

            cy.contains('Please copy your new API token.');

            cy.getByTestId('close-api-token').click();

            cy.contains('Manage API Tokens');

            cy.getByTestId('api-tokens').should('contain', 'A Token');
        });

        it('updates permissions of a token', () => {
            createToken('A Token');

            cy.getByTestId('permissions-button').click();

            cy.getByTestId('api-token-permissions-modal').find(':checked').should('have.length', 1);

            cy.getByTestId('api-token-permissions-modal').within(() => {
                cy.get('#create').check();
            });

            cy.getByTestId('save-permissions').click();

            cy.getByTestId('permissions-button').click();

            cy.getByTestId('api-token-permissions-modal').find(':checked').should('have.length', 2);

            cy.getByTestId('cancel-permissions').click();
        });

        it('deletes a token', () => {
            createToken('A Token');

            cy.get('main').should('contain', 'Manage API Tokens');

            cy.getByTestId('delete-button').click();

            cy.contains('Are you sure you would like to delete this API token?');

            cy.getByTestId('delete-confirm-button').click();

            cy.get('main').should('not.contain', 'Manage API Tokens');
        });
    });
});
