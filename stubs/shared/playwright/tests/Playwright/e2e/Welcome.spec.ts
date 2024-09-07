import { test, expect, type Page } from '@playwright/test';
import { config, pageTitle, login, logout } from './helpers';

test.describe('Welcome', () => {
    test.describe('Permissions', () => {
        test('allows guests', async ({ page }: { page: Page }) => {
            await logout(page);

            await page.goto('/');

            await expect(page).toHaveURL('/');
        });

        test('allows users', async ({ page }: { page: Page }) => {
            await login(page);

            await page.goto('/');

            await expect(page).toHaveURL('/');
        });
    });

    test.describe('The Page', () => {
        test.beforeEach(async ({ page }) => {
            await logout(page);
            await page.goto('/');
        });

        test('has the correct title', async ({ page }: { page: Page }) => {
            expect(await page.title()).toBe(pageTitle('Welcome'));
        });

        test('has a link to the Log in page', async ({ page }: { page: Page }) => {
            await page.getByRole('link', { name: 'Log in' }).click();

            await expect(page).toHaveURL('/login');
        });

        test('has a link to the Register page if feature is enabled', async ({
            page,
        }: {
            page: Page;
        }) => {
            if (!config.features.registration) {
                await expect(page.getByRole('link', { name: 'Register' })).toHaveCount(0);

                return;
            }

            await page.getByRole('link', { name: 'Register' }).click();

            await expect(page).toHaveURL('/register');
        });
    });
});
