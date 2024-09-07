import { test, expect, type Page } from '@playwright/test';
import { config, create, currentUser, fakePerson, login, logout, pageTitle } from './../helpers';

test.describe('Registration', () => {
    test.describe('Feature Check', () => {
        test('does not render the page if the feature is disabled', async ({
            page,
        }: {
            page: Page;
        }) => {
            if (!config.features.registration) {
                await logout(page);

                const response = await page.request.get('/register');

                expect(response.status()).toBe(404);
            }
        });
    });

    if (!config.features.registration) {
        return;
    }

    test.describe('Permissions', () => {
        test('allows guests', async ({ page }: { page: Page }) => {
            await logout(page);

            await page.goto('/register');

            await expect(page).toHaveURL('/register');
        });

        test('redirects authorised users to the home page', async ({ page }: { page: Page }) => {
            await login(page);

            await page.goto('/register');

            await expect(page).toHaveURL('/dashboard');
        });
    });

    test.describe('The Page', () => {
        test.beforeEach(async ({ page }) => {
            await logout(page);

            await page.goto('/register');
        });

        test('has the correct title', async ({ page }: { page: Page }) => {
            expect(await page.title()).toBe(pageTitle('Register'));
        });

        test('has focus on the name field', async ({ page }: { page: Page }) => {
            await expect(page.getByLabel('Name')).toBeFocused();
        });

        test('has a link to the Terms of Service', async ({ page }: { page: Page }) => {
            if (!config.features.termsAndPrivacyPolicy) {
                await expect(page.getByRole('link', { name: 'Terms of Service' })).toHaveCount(0);

                return;
            }

            await page.getByRole('link', { name: 'Terms of Service' }).click();

            await expect(page).toHaveURL('/terms-of-service');
        });

        test('has a link to the Privacy Policy', async ({ page }: { page: Page }) => {
            if (!config.features.termsAndPrivacyPolicy) {
                await expect(page.getByRole('link', { name: 'Privacy Policy' })).toHaveCount(0);

                return;
            }

            await page.getByRole('link', { name: 'Privacy Policy' }).click();

            await expect(page).toHaveURL('/privacy-policy');
        });

        test('has a link to the Log in page', async ({ page }: { page: Page }) => {
            await page.getByRole('link', { name: 'Already registered?' }).click();

            await expect(page).toHaveURL('/login');
        });
    });

    test.describe('Validation', () => {
        test.beforeEach(async ({ page }) => {
            await logout(page);

            await page.goto('/register');
        });

        test('ensure fields are required', async ({ page }: { page: Page }) => {
            page.locator('input#name[required]');
            page.locator('input#email[required]');
            page.locator('input#password[required]');
            page.locator('input#password_confirmation[required]');

            if (config.features.termsAndPrivacyPolicy) {
                page.locator('input#terms[required]');
            }
        });

        test('fails when the password is less than 8 characters long', async ({
            page,
        }: {
            page: Page;
        }) => {
            await page.getByLabel('Name').fill('Some One');
            await page.getByLabel('Email').fill('someone@example.com');
            await page.getByLabel('Password', { exact: true }).fill('passwrd');
            await page.getByLabel('Confirm Password').fill('passwrd');

            if (config.features.termsAndPrivacyPolicy) {
                await page.getByLabel('I agree to the Terms of').check();
            }

            await page.getByRole('button', { name: 'Register' }).click();

            await expect(page).toHaveURL('/register');

            await expect(
                page.getByText('The password field must be at least 8 characters.'),
            ).toBeVisible();
        });

        test('fails when the password is not the same as the confirmed password', async ({
            page,
        }: {
            page: Page;
        }) => {
            await page.getByLabel('Name').fill('Some Body');
            await page.getByLabel('Email').fill('somebody@example.com');
            await page.getByLabel('Password', { exact: true }).fill('password');
            await page.getByLabel('Confirm Password').fill('a-different-password');

            if (config.features.termsAndPrivacyPolicy) {
                await page.getByLabel('I agree to the Terms of').check();
            }

            await page.getByRole('button', { name: 'Register' }).click();

            await expect(page).toHaveURL('/register');

            await expect(
                page.getByText('The password field confirmation does not match.'),
            ).toBeVisible();
        });
    });

    test.describe('The Registration Process', () => {
        test.beforeEach(async ({ page }) => {
            await logout(page);

            await page.goto('/register');
        });

        test('registers and logs user in if verification is turned off', async ({
            page,
        }: {
            page: Page;
        }) => {
            if (config.features.emailVerification) {
                return;
            }

            const person = fakePerson();

            await page.getByLabel('Name').fill(person.name);
            await page.getByLabel('Email').fill(person.email);
            await page.getByLabel('Password', { exact: true }).fill(person.password);
            await page.getByLabel('Confirm Password').fill(person.password);

            if (config.features.termsAndPrivacyPolicy) {
                await page.getByLabel('I agree to the Terms of').check();
            }

            await page.getByRole('button', { name: 'Register' }).click();

            await expect(page).toHaveURL('/dashboard');

            const user = await currentUser(page);

            expect(user?.name).toBe(person.name);
            expect(user?.email).toBe(person.email);
        });

        test('sends the verification emails if verification is turned on', async ({
            page,
        }: {
            page: Page;
        }) => {
            if (!config.features.emailVerification) {
                return;
            }

            const person = fakePerson();

            await page.getByLabel('Name').fill(person.name);
            await page.getByLabel('Email').fill(person.email);
            await page.getByLabel('Password', { exact: true }).fill(person.password);
            await page.getByLabel('Confirm Password').fill(person.password);

            if (config.features.termsAndPrivacyPolicy) {
                await page.getByLabel('I agree to the Terms of').check();
            }

            await page.getByRole('button', { name: 'Register' }).click();

            await expect(page).toHaveURL(config.profileRoute);

            expect(await page.title()).toBe(pageTitle('Email Verification'));

            await expect(page.getByText('could you verify your email address')).toBeVisible();

            // Request another email to be sent
            await page.getByRole('button', { name: 'Resend Verification Email' }).click();

            await expect(page).toHaveURL(config.profileRoute);

            await expect(
                page.getByText('A new verification link has been sent to the email address'),
            ).toBeVisible();
        });

        test('fails when the email provided has already been taken', async ({
            page,
        }: {
            page: Page;
        }) => {
            const person = fakePerson();

            await create(page, 'App\\Models\\User', person);

            await page.getByLabel('Name').fill(person.name);
            await page.getByLabel('Email').fill(person.email);
            await page.getByLabel('Password', { exact: true }).fill('password');
            await page.getByLabel('Confirm Password').fill('password');

            if (config.features.termsAndPrivacyPolicy) {
                await page.getByLabel('I agree to the Terms of').check();
            }

            await page.getByRole('button', { name: 'Register' }).click();

            await expect(page).toHaveURL('/register');

            await expect(page.getByText('The email has already been taken.')).toBeVisible();
        });
    });

    if (!config.features.termsAndPrivacyPolicy) {
        return;
    }

    test.describe('The Terms of Service', () => {
        test('displays the terms of service', async ({ page }: { page: Page }) => {
            await logout(page);

            await page.goto('/register');

            await page.getByRole('link', { name: 'Terms of Service' }).click();

            await expect(page).toHaveURL('/terms-of-service');
        });

        test('has the correct title', async ({ page }: { page: Page }) => {
            await logout(page);

            await page.goto('/terms-of-service');

            expect(await page.title()).toBe(pageTitle('Terms of Service'));
        });
    });

    test.describe('The Privacy Policy', () => {
        test('displays the privacy policy', async ({ page }: { page: Page }) => {
            await logout(page);

            await page.goto('/register');

            await page.getByRole('link', { name: 'Privacy Policy' }).click();

            await expect(page).toHaveURL('/privacy-policy');
        });

        test('has the correct title', async ({ page }: { page: Page }) => {
            await logout(page);

            await page.goto('/privacy-policy');

            expect(await page.title()).toBe(pageTitle('Privacy Policy'));
        });
    });
});
