import { defineConfig } from 'cypress';

export default defineConfig({
    downloadsFolder: 'tests/Cypress/downloads',
    fixturesFolder: 'tests/Cypress/fixtures',
    screenshotsFolder: 'tests/Cypress/screenshots',
    videosFolder: 'tests/Cypress/videos',

    e2e: {
        baseUrl: 'http://localhost:8000',
        specPattern: 'tests/Cypress/e2e/**/*.cy.ts',
        supportFile: 'tests/Cypress/support/e2e.ts',
    },

    env: {
        /**
         * Keep this aligned to config('app.name').
         */
        appName: 'Laravel',

        users: {
            user: {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password',
            },
            team: {
                id: 1,
                owner: {
                    name: 'Team One Owner',
                    email: 'teamowner@example.com',
                    password: 'password',
                },
                admin: {
                    name: 'Team One Admin',
                    email: 'teamadmin@example.com',
                    password: 'password',
                },
                editor: {
                    name: 'Team One Editor',
                    email: 'teameditor@example.com',
                    password: 'password',
                },
            },
        },

        profileRoute: '/user/profile',

        /**
         * Changes to features here must be kept in sync with
         *     - /config/fortify.php
         *     - /config/jetstream.php
         *
         * Set emailVerification to true if App\Models\User implements MustVerifyEmail
         */
        features: {
            accountDeletion: false,
            api: false,
            emailVerification: false,
            logsOutOtherBrowserSessions: true,
            registration: false,
            resetPasswords: false,
            teams: false,
            termsAndPrivacyPolicy: false,
            twoFactorAuthentication: false,
            updatePasswords: false,
            updateProfileInformation: false,
        },
    },
});
