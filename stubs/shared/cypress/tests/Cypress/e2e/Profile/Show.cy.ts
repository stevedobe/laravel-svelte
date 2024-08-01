describe('Profile', () => {
    const env = Cypress.env();

    const profileRoute = env.profileRoute;

    context('Permissions', () => {
        it('forbids guests', () => {
            cy.logout().visit(profileRoute);

            cy.location('pathname').should('eq', '/login');
        });

        it('allows authorised users', () => {
            cy.login().visit(profileRoute);

            cy.location('pathname').should('eq', profileRoute);
        });
    });

    context('The Page', () => {
        beforeEach(() => {
            cy.login().visit(profileRoute);
        });

        it('has the correct title', () => {
            cy.title().should('eq', `Profile | ${env.appName}`);
        });

        it('updates the Profile Information', () => {
            if (!env.features.updateProfileInformation) {
                cy.get('body').should('not.contain', 'Profile Information');

                return;
            }

            cy.contains('Profile Information');

            cy.get('#name').clear();
            cy.get('#name').type('Some Other Name');

            cy.get('[data-cy=profile-information-button]').click();

            cy.contains('Saved.');
        });

        it('updates the password', () => {
            if (!env.features.updatePasswords) {
                cy.get('body').should('not.contain', 'Update Password');

                return;
            }

            cy.contains('Update Password');

            cy.get('#current_password').clear();
            cy.get('#current_password').type('password');

            cy.get('#password').clear();
            cy.get('#password').type('another-password');

            cy.get('#password_confirmation').clear();
            cy.get('#password_confirmation').type('another-password');

            cy.get('[data-cy=update-password-button]').click();

            cy.contains('Saved.');
        });

        it('enables two factor authentication', () => {
            if (!env.features.twoFactorAuthentication) {
                cy.get('body').should('not.contain', 'Two Factor Authentication');

                return;
            }

            cy.contains('Two Factor Authentication');

            cy.get('[data-cy=two-factor-authentication-button]').click();

            cy.get('[data-cy=confirms-password-form-password]').type('password');
            cy.get('[data-cy=confirms-password-form-password]').type('{enter}');

            cy.contains('Setup Key:');
        });

        it('logs out other browser sessions', () => {
            if (!env.features.logsOutOtherBrowserSessions) {
                return;
            }

            cy.contains('Browser Sessions');

            cy.get('[data-cy=logout-other-browser-sessions-button]').click();

            cy.get('[data-cy=logout-other-browser-sessions-form-password]').type('password');
            cy.get('[data-cy=logout-other-browser-sessions-form-password]').type('{enter}');

            cy.contains('Done.');
        });

        it('delete the account', () => {
            if (!env.features.accountDeletion) {
                cy.get('body').should('not.contain', 'Delete Account');

                return;
            }

            cy.contains('Delete Account');

            cy.get('[data-cy=delete-account-button]').click();

            cy.get('[data-cy=delete-user-form-password]').type('password');
            cy.get('[data-cy=delete-user-form-password]').type('{enter}');

            cy.location('pathname').should('eq', '/');
        });
    });
});
