declare namespace Cypress {
    interface Chainable {
        /**
         * Log in the user with the given attributes, or create a new user and then log them in.
         *
         * @example
         * cy.login()
         * cy.login({ email: user@example.com })
         */
        login(attributes?: Cypress.RequestBody): Chainable;

        /**
         * Log out the current user.
         *
         * @example
         * cy.logout()
         */
        logout(): Chainable;
    }
}
