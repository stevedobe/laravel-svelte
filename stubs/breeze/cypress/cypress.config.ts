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
        },

        profileRoute: '/profile',

        /**
         * Set emailVerification to true if App\Models\User implements MustVerifyEmail
         */
        features: {
            accountDeletion: true,
            api: false,
            emailVerification: false,
            logsOutOtherBrowserSessions: false,
            registration: true,
            resetPasswords: true,
            teams: false,
            termsAndPrivacyPolicy: false,
            twoFactorAuthentication: false,
            updatePasswords: true,
            updateProfileInformation: true,
        },
    },
});
