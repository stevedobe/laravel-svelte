import { test, expect, type Page } from '@playwright/test';
import { config, login, logout, pageTitle } from './../helpers';

test.describe('Create New Team', () => {
    test.describe('Feature Check', () => {
        test('does not render the page if the feature is disabled', async ({
            page,
        }: {
            page: Page;
        }) => {
            if (!config.features.teams) {
                await login(page);

                const response = await page.request.get('/teams/create');

                expect(response.status()).toBe(404);
            }
        });
    });

    if (!config.features.teams) {
        return;
    }

    test.describe('Permissions', () => {
        test('forbids guests', async ({ page }: { page: Page }) => {
            await logout(page);

            await page.goto('/teams/create');

            await expect(page).toHaveURL('/login');
        });

        test('allows authorised users', async ({ page }: { page: Page }) => {
            await login(page);

            await page.goto('/teams/create');

            await expect(page).toHaveURL('/teams/create');
        });
    });

    test.describe('The Page', () => {
        test.beforeEach(async ({ page }) => {
            await login(page);

            await page.goto('/teams/create');
        });

        test('has the correct title', async ({ page }: { page: Page }) => {
            expect(await page.title()).toBe(pageTitle('Create Team'));
        });

        test('creates a team', async ({ page }: { page: Page }) => {
            await expect(page.getByText('Team Details')).toBeVisible();

            await page.getByLabel('Team Name').fill('My New Team');

            await page.getByTestId('create-button').click();

            await expect(page).toHaveURL('/dashboard');
        });
    });
});
