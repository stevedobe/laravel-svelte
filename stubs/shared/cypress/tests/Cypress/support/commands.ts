/// <reference path="./commands.d.ts" />

Cypress.Commands.add('login', (attributes = {}) => {
    return cy.request('/__testing__/login', attributes);
});

Cypress.Commands.add('logout', () => {
    return cy.request('/__testing__/logout');
});
