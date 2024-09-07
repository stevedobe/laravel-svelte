import { test, expect, type Page } from '@playwright/test';
import { currentUser, login } from './../helpers';

test.describe('Logging Out', () => {
    test.beforeEach(async ({ page }) => {
        await login(page);

        await page.goto('/dashboard');
    });

    test('succeeds when clicking on the Log out link', async ({ page }: { page: Page }) => {
        // Restrict to visible only so that it chooses either the desktop or mobile menu.
        await page.getByTestId('user-menu').locator('visible=true').click();

        await page.getByRole('button', { name: 'Log Out', exact: true }).click();

        await expect(page).toHaveURL('/');

        const user = await currentUser(page);

        expect(user).toBeNull();
    });

    test('fails with a GET request to /logout', async ({ page }: { page: Page }) => {
        const response = await page.request.get('/logout');

        expect(response.status()).toBe(405);
    });
});
