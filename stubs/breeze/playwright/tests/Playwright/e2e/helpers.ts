import { faker } from '@faker-js/faker';
import type { Page } from '@playwright/test';
import type { User } from '@/Types';

export const fakePerson = () => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    return {
        name: faker.person.fullName({
            firstName: firstName,
            lastName: lastName,
        }),
        email: faker.internet.email({
            firstName: firstName.toLowerCase(),
            lastName: lastName.toLowerCase(),
        }),
        password: faker.internet.password(),
    };
};

export const config = {
    // Keep this aligned to config('app.name').
    appName: 'Laravel',

    // The profile route differs between Breeze and Jetstream.
    profileRoute: '/profile',

    /**
     * Changes to features here must be kept in sync with
     *     - /config/fortify.php
     *     - /config/jetstream.php
     *
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
};

/**
 * Get a CSRF token.
 */
async function csrfToken(page: Page): Promise<JSON> {
    const csrfToken = await page.request.get('/__testing__/csrf-token');

    return await csrfToken.json();
}

/**
 * Get the title of the page.
 */
export const pageTitle = (title = '') => (title ? `${title} | ${config.appName}` : config.appName);

/**
 * Get the currently authenticated user.
 */
export async function currentUser(page: Page): Promise<User | null> {
    const response = await page.request.get('/__testing__/current-user');

    return response.json().catch(() => null);
}

/**
 * Find or create a user and log them into the application.
 */
export async function login(page: Page, attributes = {}): Promise<JSON> {
    const response = await page.request.post('/__testing__/login', {
        data: { _token: await csrfToken(page), attributes },
    });

    return await response.json();
}

/**
 * Log the authenticated user out of the application.
 */
export async function logout(page: Page): Promise<void> {
    await page.request.post('/__testing__/logout', {
        data: { _token: await csrfToken(page) },
    });
}

/**
 * Create a new Eloquent model.
 */
export async function create(page: Page, model: string, attributes = {}): Promise<JSON> {
    const response = await page.request.post('/__testing__/model', {
        data: { _token: await csrfToken(page), model, attributes },
    });

    return await response.json();
}
