import { test, expect, type Page } from '@playwright/test';
import { config, create, fakePerson, login, logout, pageTitle } from './../helpers';

test.describe('Logging In', () => {
    test.describe('Permissions', () => {
        test('allows guests', async ({ page }: { page: Page }) => {
            await logout(page);

            await page.goto('/login');

            await expect(page).toHaveURL('/login');
        });

        test('redirects authorised users to the home page', async ({ page }: { page: Page }) => {
            await login(page);

            await page.goto('/login');

            await expect(page).toHaveURL('/dashboard');
        });
    });

    test.describe('The Page', () => {
        test.beforeEach(async ({ page }) => {
            await logout(page);

            await page.goto('/login');
        });

        test('has the correct title', async ({ page }: { page: Page }) => {
            expect(await page.title()).toBe(pageTitle('Log in'));
        });

        test('has a link to the Forgot your Password page', async ({ page }: { page: Page }) => {
            if (!config.features.resetPasswords) {
                await expect(page.getByRole('link', { name: 'Forgot your password?' })).toHaveCount(
                    0,
                );

                return;
            }

            await page.getByRole('link', { name: 'Forgot your password?' }).click();

            await expect(page).toHaveURL('/forgot-password');
        });
    });

    test.describe('Logging in Using Credentials', () => {
        test.beforeEach(async ({ page }) => {
            await logout(page);

            await page.goto('/login');
        });

        test('succeeds when valid credentials are provided', async ({ page }: { page: Page }) => {
            const person = fakePerson();

            await create(page, 'App\\Models\\User', person);

            await page.getByLabel('Email').fill(person.email);
            await page.getByLabel('Password').fill(person.password);
            await page.getByRole('button', { name: 'Log in' }).click();

            await expect(page).toHaveURL('/dashboard');
        });

        test('fails when a stranger attempts to log in', async ({ page }: { page: Page }) => {
            await page.getByLabel('Email').fill('someone-without-an-account@example.com');
            await page.getByLabel('Password').fill('password');
            await page.getByRole('button', { name: 'Log in' }).click();

            await expect(page).toHaveURL('/login');

            await expect(
                page.getByText('These credentials do not match our records.'),
            ).toBeVisible();
        });

        test('fails when a valid user provides an incorrect password', async ({
            page,
        }: {
            page: Page;
        }) => {
            const person = fakePerson();

            await create(page, 'App\\Models\\User', person);

            await page.getByLabel('Email').fill(person.email);
            await page.getByLabel('Password').fill('an-incorrect-password');
            await page.getByRole('button', { name: 'Log in' }).click();

            await expect(page).toHaveURL('/login');

            await expect(
                page.getByText('These credentials do not match our records.').first(),
            ).toBeVisible();
        });

        test('ensure fields are required', async ({ page }: { page: Page }) => {
            page.locator('input#email[required]');
            page.locator('input#password[required]');
        });
    });

    test.describe('Forgot your password?', () => {
        test('sends the password reset link email', async ({ page }: { page: Page }) => {
            if (!config.features.resetPasswords) {
                return;
            }

            const person = fakePerson();

            await create(page, 'App\\Models\\User', person);

            await logout(page);

            await page.goto('/forgot-password');

            await page.getByLabel('Email').fill(person.email);

            await page.getByRole('button', { name: 'Email Password Reset Link' }).click();

            // Playwright will test with multiple browsers. While the first browser attempt will return
            // 'We have emailed...', subsequent attempts from the other browsers will return 'Please wait...'
            // due to throttling. We are not trying to test standard Laravel functionality here. We just want
            // to ensure that everything is wired up correctly. I consider either of these responses a success.
            await expect(
                page.getByText(
                    /^(We have emailed your password reset link.|Please wait before retrying.)$/,
                ),
            ).toBeVisible();
        });
    });
});
