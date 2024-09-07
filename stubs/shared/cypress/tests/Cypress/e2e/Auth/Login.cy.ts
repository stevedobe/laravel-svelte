import { fakePerson, pageTitle } from './../helpers';

describe('Logging In', () => {
    const env = Cypress.env();

    context('Permissions', () => {
        it('allows guests', () => {
            cy.logout().visit('/login');

            cy.location('pathname').should('eq', '/login');
        });

        it('redirects authorised users to the home page', () => {
            cy.login().visit('/login');

            cy.location('pathname').should('eq', '/dashboard');
        });
    });

    context('The Page', () => {
        beforeEach(() => {
            cy.logout().visit('/login');
        });

        it('has the correct title', () => {
            cy.title().should('eq', pageTitle('Log in'));
        });

        it('has a link to the Forgot your Password page', () => {
            if (!env.features.resetPasswords) {
                cy.get('form').should('not.contain', 'Forgot your password?');

                return;
            }

            cy.contains('Forgot your password?').click();

            cy.location('pathname').should('eq', '/forgot-password');
        });
    });

    context('Logging in Using Credentials', () => {
        beforeEach(() => {
            cy.logout().visit('/login');
        });

        it('succeeds when valid credentials are provided', () => {
            const person = fakePerson();

            cy.create('App\\Models\\User', person);

            cy.get('input[type=email]').type(person.email);
            cy.get('input[type=password]').type(person.password);
            cy.get('button[type=submit]').click();

            cy.location('pathname').should('eq', '/dashboard');
        });

        it('fails when a stranger attempts to log in', () => {
            cy.get('input[type=email]').type('someone-without-an-account@example.com');
            cy.get('input[type=password]').type('password');
            cy.get('button[type=submit]').click();

            cy.location('pathname').should('eq', '/login');

            cy.get('input:invalid').should('have.length', 1);

            cy.contains('These credentials do not match our records.');
        });

        it('fails when a valid user provides an incorrect password', () => {
            const person = fakePerson();

            cy.create('App\\Models\\User', person);

            cy.get('input[type=email]').type(person.email);
            cy.get('input[type=password]').type('an-incorrect-password');
            cy.get('button[type=submit]').click();

            cy.location('pathname').should('eq', '/login');

            cy.get('input:invalid').should('have.length', 1);

            cy.contains('These credentials do not match our records.');
        });

        it('ensures fields are required', () => {
            cy.get('input#email[required]');
            cy.get('input#password[required]');
        });
    });

    context('Forgot your password?', () => {
        it('sends the password reset link email', () => {
            if (!env.features.resetPasswords) {
                cy.log('Resetting passwords is disabled.');

                return;
            }

            const person = fakePerson();

            cy.create('App\\Models\\User', person);

            cy.intercept('POST', '/forgot-password').as('emailPasswordResetLink');

            cy.logout().visit('/forgot-password');

            cy.get('input[type=email]').type(person.email);

            cy.get('button[type=submit]').click();

            cy.wait('@emailPasswordResetLink');

            cy.contains(
                /^(We have emailed your password reset link.|Please wait before retrying.)$/,
            );
        });
    });
});
