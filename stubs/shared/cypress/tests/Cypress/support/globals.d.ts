declare namespace Cypress {
    interface Chainable {
        /**
         * Select an element by its data-testid attribute.
         *
         * @example
         * cy.getByTestId('save-button')
         */
        getByTestId(selector: string): Chainable;

        /**
         * Get a CSRF token.
         *
         * @example
         * cy.csrfToken()
         */
        csrfToken(): Chainable;

        /**
         * Get the currently authenticated user.
         *
         * @example
         * cy.currentUser()
         */
        currentUser(): Chainable;

        /**
         * Log in the user with the given attributes, or create a new user and then log them in.
         *
         * @example
         * cy.login()
         * cy.login({ id: 1 })
         * cy.login({ email: user@example.com })
         */
        login(attributes?: RequestBody): Chainable;

        /**
         * Log out the current user.
         */
        logout(): Chainable;

        /**
         * Create a new Eloquent model.
         *
         * @example
         * cy.create('App\\Models\\User');
         * cy.create('App\\Models\\User', { email: user@example.com });
         */
        create(model: string, attributes?: RequestBody): Chainable;
    }
}
