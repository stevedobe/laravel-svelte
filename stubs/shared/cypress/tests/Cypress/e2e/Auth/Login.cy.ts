describe('Logging In', () => {
    const env = Cypress.env();

    before(() => {
        cy.exec('php artisan migrate:fresh --seed --env=testing').its('code').should('eq', 0);
    });

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
            cy.title().should('eq', `Log in | ${env.appName}`);
        });

        it('has a link to the Forgot your Password page', () => {
            if (!env.features.resetPasswords) {
                cy.get('form').should('not.contain', 'Forgot your password?');

                return;
            }

            cy.contains('Forgot your password?').should(
                'have.attr',
                'href',
                Cypress.config().baseUrl + '/forgot-password',
            );
        });
    });

    context('Logging in Using Credentials', () => {
        beforeEach(() => {
            cy.logout().visit('/login');
        });

        it('succeeds when valid credentials are provided', () => {
            cy.get('input[type=email]').type(env.users.user.email);
            cy.get('input[type=password]').type(env.users.user.password);
            cy.get('button[type=submit]').click();

            cy.location('pathname').should('eq', '/dashboard');
        });

        it('fails when a stranger attempts to log in', () => {
            cy.get('input[type=email]').type('someone-without-an-account@example.com');
            cy.get('input[type=password]').type(env.users.user.password);
            cy.get('button[type=submit]').click();

            cy.get('input:invalid').should('have.length', 1);

            cy.contains('These credentials do not match our records.');
        });

        it('fails when a valid user provides an incorrect password', () => {
            cy.get('input[type=email]').type(env.users.user.email);
            cy.get('input[type=password]').type('an-incorrect-password');
            cy.get('button[type=submit]').click();

            cy.get('input:invalid').should('have.length', 1);

            cy.contains('These credentials do not match our records.');
        });

        it('fails when required fields are not provided', () => {
            cy.get('button[type=submit]').click();

            cy.get('input:invalid').should('have.length', 2);

            cy.get('#email').then(($input) => {
                expect(($input[0] as HTMLObjectElement).validationMessage).to.eq(
                    'Please fill in this field.',
                );
            });

            cy.get('#password').then(($input) => {
                expect(($input[0] as HTMLObjectElement).validationMessage).to.eq(
                    'Please fill in this field.',
                );
            });
        });
    });

    context('Forgot your password?', () => {
        before(() => {
            cy.logout().visit('/login');
        });

        it('sends the password reset link email', () => {
            if (!env.features.resetPasswords) {
                cy.log('Resetting passwords is disabled.');
                return;
            }

            cy.intercept('POST', '/forgot-password').as('emailPasswordResetLink');

            cy.contains('Forgot your password?').click();

            cy.location('pathname').should('eq', '/forgot-password');

            cy.get('input[type=email]').type(env.users.user.email);

            cy.get('button[type=submit]').click();

            cy.wait('@emailPasswordResetLink');

            cy.contains('We have emailed your password reset link.');
        });
    });
});
