describe('Registration', () => {
    const env = Cypress.env();

    context('Feature Check', () => {
        it('does not render the page if the feature is disabled', () => {
            if (!env.features.registration) {
                cy.logout();

                cy.request({
                    url: '/register',
                    failOnStatusCode: false,
                }).then((response) => {
                    expect(response.status).to.eq(404);
                });
            }
        });
    });

    if (!env.features.registration) {
        return;
    }

    context('Permissions', () => {
        it('allows guests', () => {
            cy.logout().visit('/register');

            cy.location('pathname').should('eq', '/register');
        });

        it('redirects authorised users to the home page', () => {
            cy.login().visit('/register');

            cy.location('pathname').should('eq', '/dashboard');
        });
    });

    context('The Page', () => {
        before(() => {
            cy.logout();
        });

        beforeEach(() => {
            cy.visit('/register');
        });

        it('has the correct title', () => {
            cy.title().should('eq', `Register | ${env.appName}`);
        });

        it('has focus on the name field', () => {
            cy.get('#name').should('have.focus');
        });

        it('has a link to the Terms of Service', () => {
            if (!env.features.termsAndPrivacyPolicy) {
                cy.get('form').should('not.contain', 'Terms of Service');

                return;
            }

            cy.contains('Terms of Service').should(
                'have.attr',
                'href',
                Cypress.config().baseUrl + '/terms-of-service',
            );
        });

        it('has a link to the Privacy Policy', () => {
            if (!env.features.termsAndPrivacyPolicy) {
                cy.get('form').should('not.contain', 'Privacy Policy');

                return;
            }

            cy.contains('Privacy Policy').should(
                'have.attr',
                'href',
                Cypress.config().baseUrl + '/privacy-policy',
            );
        });

        it('has a link to the Log in page', () => {
            cy.contains('Already registered?').should(
                'have.attr',
                'href',
                Cypress.config().baseUrl + '/login',
            );
        });
    });

    context('Validation', () => {
        before(() => {
            cy.logout();
        });

        beforeEach(() => {
            cy.visit('/register');
        });

        it('fails when required fields are not provided', () => {
            cy.get('#password_confirmation').type(env.users.user.password);
            cy.get('button[type=submit]').click();

            cy.get('input:invalid').should(
                'have.length',
                env.features.termsAndPrivacyPolicy ? 4 : 3,
            );

            cy.get('#name').then(($input) => {
                expect(($input[0] as HTMLObjectElement).validationMessage).to.eq(
                    'Please fill in this field.',
                );
            });

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

            if (env.features.termsAndPrivacyPolicy) {
                cy.get('#terms').then(($input) => {
                    expect(($input[0] as HTMLObjectElement).validationMessage).to.eq(
                        'Please tick this box if you want to proceed.',
                    );
                });
            }
        });

        it('fails when the email field is not an email address', () => {
            cy.get('#name').type(env.users.user.name);
            cy.get('#email').type('not-a-valid-email-address');
            cy.get('#password').type(env.users.user.password);
            cy.get('#password_confirmation').type(env.users.user.password);

            if (env.features.termsAndPrivacyPolicy) {
                cy.get('#terms').check();
            }

            cy.get('button[type=submit]').click();

            cy.get('input:invalid').should('have.length', 1);

            cy.get('#email').then(($input) => {
                expect(($input[0] as HTMLObjectElement).validationMessage).to.eq(
                    "Please include an '@' in the email address. 'not-a-valid-email-address' is missing an '@'.",
                );
            });
        });

        it('fails when the password is less than 8 characters long', () => {
            cy.get('#name').type('Some One');
            cy.get('#email').type('someone@example.com');
            cy.get('#password').type('passwrd');
            cy.get('#password_confirmation').type('passwrd');

            if (env.features.termsAndPrivacyPolicy) {
                cy.get('#terms').check();
            }

            cy.get('button[type=submit]').click();

            cy.location('pathname').should('eq', '/register');

            cy.contains('The password field must be at least 8 characters.');
        });

        it('fails when the password is not the same as the confirmed password', () => {
            cy.get('#name').type('Some Body');
            cy.get('#email').type('somebody@example.com');
            cy.get('#password').type(env.users.user.password);
            cy.get('#password_confirmation').type('a-different-password');

            if (env.features.termsAndPrivacyPolicy) {
                cy.get('#terms').check();
            }

            cy.get('button[type=submit]').click();

            cy.location('pathname').should('eq', '/register');

            cy.contains('The password field confirmation does not match.');
        });
    });

    context('The Registration Process', () => {
        before(() => {
            cy.exec('php artisan migrate:fresh --env=testing').its('code').should('eq', 0);
        });

        beforeEach(() => {
            cy.logout().visit('/register');
        });

        it('registers and logs user in if verification is turned off', () => {
            if (env.features.emailVerification) {
                return;
            }

            cy.intercept('POST', '/register').as('registerUser');

            cy.get('#name').type(env.users.user.name);
            cy.get('#email').type(env.users.user.email);
            cy.get('#password').type(env.users.user.password);
            cy.get('#password_confirmation').type(env.users.user.password);

            if (env.features.termsAndPrivacyPolicy) {
                cy.get('#terms').check();
            }

            cy.get('button[type=submit]').click();

            cy.wait('@registerUser');

            cy.location('pathname').should('eq', '/dashboard');
        });

        it('sends the verification emails if verification is turned on', () => {
            if (!env.features.emailVerification) {
                return;
            }

            cy.intercept('POST', '/register').as('registerUser');
            cy.intercept('POST', '/email/verification-notification').as('resendEmail');

            cy.get('#name').type(env.users.user.name);
            cy.get('#email').type(env.users.user.email);
            cy.get('#password').type(env.users.user.password);
            cy.get('#password_confirmation').type(env.users.user.password);

            if (env.features.termsAndPrivacyPolicy) {
                cy.get('#terms').check();
            }

            cy.get('button[type=submit]').click();

            cy.wait('@registerUser');

            cy.location('pathname').should('eq', '/email/verify');

            cy.title().should('eq', `Email Verification | ${env.appName}`);
            cy.contains('could you verify your email address');

            // Request another email to be sent
            cy.contains('Resend Verification Email').click();

            cy.wait('@resendEmail');

            cy.location('pathname').should('eq', '/email/verify');

            cy.contains('A new verification link has been sent to the email address');
        });

        it('fails when the email provided has already been taken', () => {
            cy.get('#name').type('Different Name');
            cy.get('#email').type(env.users.user.email);
            cy.get('#password').type('any-password');
            cy.get('#password_confirmation').type('any-password');

            if (env.features.termsAndPrivacyPolicy) {
                cy.get('#terms').check();
            }

            cy.get('button[type=submit]').click();

            cy.location('pathname').should('eq', '/register');

            cy.contains('The email has already been taken.');
        });
    });

    if (!env.features.termsAndPrivacyPolicy) {
        return;
    }

    context('The Terms of Service', () => {
        it('displays the terms of service', () => {
            cy.logout().visit('/register');

            cy.contains('Terms of Service').click();

            cy.location('pathname').should('eq', '/terms-of-service');
        });

        it('has the correct title', () => {
            cy.logout().visit('/terms-of-service');

            cy.title().should('eq', `Terms of Service | ${env.appName}`);
        });
    });

    context('The Privacy Policy', () => {
        it('displays the privacy policy', () => {
            cy.logout().visit('/register');

            cy.contains('Privacy Policy').click();

            cy.location('pathname').should('eq', '/privacy-policy');
        });

        it('has the correct title', () => {
            cy.logout().visit('/privacy-policy');

            cy.title().should('eq', `Privacy Policy | ${env.appName}`);
        });
    });
});
