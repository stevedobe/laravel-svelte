/**
 * Select an element by its data-testid attribute.
 */
Cypress.Commands.add('getByTestId', (selector, ...args) => {
    return cy.get(`[data-testid=${selector}]`, ...args);
});

/**
 * Get a CSRF token.
 */
Cypress.Commands.add('csrfToken', () => {
    return cy.request('GET', '/__testing__/csrf-token').its('body');
});

/**
 * Get the currently authenticated user.
 */
Cypress.Commands.add('currentUser', () => {
    return cy.request('GET', '/__testing__/current-user').its('body');
});

/**
 * Find or create a user and log them into the application.
 */
Cypress.Commands.add('login', (attributes = {}) => {
    return cy
        .csrfToken()
        .then((token) => cy.request('POST', '/__testing__/login', { _token: token, attributes }))
        .its('body');
});

/**
 * Logout the current user.
 */
Cypress.Commands.add('logout', () => {
    cy.csrfToken().then((token) => cy.request('POST', '/__testing__/logout', { _token: token }));
});

/**
 * Create a new Eloquent model.
 */
Cypress.Commands.add('create', (model: string, attributes = {}) => {
    return cy
        .csrfToken()
        .then((token) =>
            cy.request('POST', '/__testing__/model', { _token: token, model, attributes }),
        )
        .its('body');
});
