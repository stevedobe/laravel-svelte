import { test, expect, type Page } from '@playwright/test';
import { pageTitle, login, logout } from './helpers';

test.describe('Dashboard', () => {
    test.describe('Permissions', () => {
        test('redirects guests to the Log in page', async ({ page }: { page: Page }) => {
            await logout(page);

            await page.goto('/dashboard');

            await expect(page).toHaveURL('/login');
        });

        test('allows users', async ({ page }: { page: Page }) => {
            await login(page);

            await page.goto('/dashboard');

            await expect(page).toHaveURL('/dashboard');
        });
    });

    test.describe('The Page', () => {
        test('has the correct title', async ({ page }: { page: Page }) => {
            await login(page);

            await page.goto('/dashboard');

            expect(await page.title()).toBe(pageTitle('Dashboard'));
        });
    });
});
