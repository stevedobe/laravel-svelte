import { fakePerson, pageTitle } from './../helpers';

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
            cy.title().should('eq', pageTitle('Register'));
        });

        it('has focus on the name field', () => {
            cy.get('#name').should('have.focus');
        });

        it('has a link to the Terms of Service', () => {
            if (!env.features.termsAndPrivacyPolicy) {
                cy.get('form').should('not.contain', 'Terms of Service');

                return;
            }

            cy.contains('Terms of Service').click();

            cy.location('pathname').should('eq', '/terms-of-service');
        });

        it('has a link to the Privacy Policy', () => {
            if (!env.features.termsAndPrivacyPolicy) {
                cy.get('form').should('not.contain', 'Privacy Policy');

                return;
            }

            cy.contains('Privacy Policy').click();

            cy.location('pathname').should('eq', '/privacy-policy');
        });

        it('has a link to the Log in page', () => {
            cy.contains('Already registered?').click();

            cy.location('pathname').should('eq', '/login');
        });
    });

    context('Validation', () => {
        beforeEach(() => {
            cy.logout().visit('/register');
        });

        it('ensures fields are required', () => {
            cy.get('input#name[required]');
            cy.get('input#email[required]');
            cy.get('input#password[required]');
            cy.get('input#password_confirmation[required]');

            if (env.features.termsAndPrivacyPolicy) {
                cy.get('input#terms[required]');
            }
        });

        it('fails when the password is less than 8 characters long', () => {
            cy.get('#name').type('Some One');
            cy.get('#email').type('someone@example.com');
            cy.get('#password').type('passwrd');
            cy.get('#password_confirmation').type('passwrd');

            if (env.features.termsAndPrivacyPolicy) {
                cy.get('input#terms').check();
            }

            cy.get('button[type=submit]').click();

            cy.location('pathname').should('eq', '/register');

            cy.contains('The password field must be at least 8 characters.');
        });

        it('fails when the password is not the same as the confirmed password', () => {
            cy.get('#name').type('Some Body');
            cy.get('#email').type('somebody@example.com');
            cy.get('#password').type('password');
            cy.get('#password_confirmation').type('a-different-password');

            if (env.features.termsAndPrivacyPolicy) {
                cy.get('input#terms').check();
            }

            cy.get('button[type=submit]').click();

            cy.location('pathname').should('eq', '/register');

            cy.contains('The password field confirmation does not match.');
        });
    });

    context('The Registration Process', () => {
        beforeEach(() => {
            cy.logout().visit('/register');
        });

        it('registers and logs user in if verification is turned off', () => {
            if (env.features.emailVerification) {
                return;
            }

            const person = fakePerson();

            cy.intercept('POST', '/register').as('registerUser');

            cy.get('#name').type(person.name);
            cy.get('#email').type(person.email);
            cy.get('#password').type(person.password);
            cy.get('#password_confirmation').type(person.password);

            if (env.features.termsAndPrivacyPolicy) {
                cy.get('input#terms').check();
            }

            cy.get('button[type=submit]').click();

            cy.wait('@registerUser');

            cy.location('pathname').should('eq', '/dashboard');

            cy.currentUser().then((user) => {
                expect(user?.name).to.equal(person.name);
                expect(user?.email).to.equal(person.email);
            });
        });

        it('sends the verification emails if verification is turned on', () => {
            if (!env.features.emailVerification) {
                return;
            }

            const person = fakePerson();

            cy.intercept('POST', '/register').as('registerUser');
            cy.intercept('POST', '/email/verification-notification').as('resendEmail');

            cy.get('#name').type(person.name);
            cy.get('#email').type(person.email);
            cy.get('#password').type('password');
            cy.get('#password_confirmation').type('password');

            if (env.features.termsAndPrivacyPolicy) {
                cy.get('input#terms').check();
            }

            cy.get('button[type=submit]').click();

            cy.wait('@registerUser');

            cy.location('pathname').should('eq', env.profileRoute);

            cy.title().should('eq', pageTitle('Email Verification'));

            cy.contains('could you verify your email address');

            // Request another email to be sent
            cy.contains('Resend Verification Email').click();

            cy.wait('@resendEmail');

            cy.location('pathname').should('eq', env.profileRoute);

            cy.contains('A new verification link has been sent to the email address');
        });

        it('fails when the email provided has already been taken', () => {
            const person = fakePerson();

            cy.create('App\\Models\\User', person);

            cy.get('#name').type(person.name);
            cy.get('#email').type(person.email);
            cy.get('#password').type('password');
            cy.get('#password_confirmation').type('password');

            if (env.features.termsAndPrivacyPolicy) {
                cy.get('input#terms').check();
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

            cy.title().should('eq', pageTitle('Terms of Service'));
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

            cy.title().should('eq', pageTitle('Privacy Policy'));
        });
    });
});
