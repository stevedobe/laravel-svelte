import { test, expect, type Page } from '@playwright/test';
import { config, login, logout, pageTitle } from './../helpers';

async function createToken(page: Page, tokenName: string): Promise<void> {
    await page.getByLabel('Name').fill(tokenName);
    await page.getByTestId('create-button').click();
    await page.getByTestId('close-api-token').click();
}

test.describe('API Tokens', () => {
    test.describe('Feature Check', () => {
        test('does not render the page if the feature is disabled', async ({
            page,
        }: {
            page: Page;
        }) => {
            if (!config.features.api) {
                await login(page);

                const response = await page.request.get('/user/api-tokens');

                expect(response.status()).toBe(404);
            }
        });
    });

    if (!config.features.api) {
        return;
    }

    test.describe('Permissions', () => {
        test('forbids guests', async ({ page }: { page: Page }) => {
            await logout(page);

            await page.goto('/user/api-tokens');

            await expect(page).toHaveURL('/login');
        });

        test('allows authorised users', async ({ page }: { page: Page }) => {
            await login(page);

            await page.goto('/user/api-tokens');

            await expect(page).toHaveURL('/user/api-tokens');
        });
    });

    test.describe('The Page', () => {
        test.beforeEach(async ({ page }) => {
            await login(page);

            await page.goto('/user/api-tokens');
        });

        test('has the correct title', async ({ page }: { page: Page }) => {
            expect(await page.title()).toBe(pageTitle('API Tokens'));
        });

        test('creates a token', async ({ page }: { page: Page }) => {
            await expect(page.getByText('Create API Token')).toBeVisible();

            await page.getByLabel('Name').fill('A Token');
            await page.getByLabel('update').check();
            await page.getByTestId('create-button').click();

            await expect(
                page.getByTestId('create-button').locator('..').getByText('Created.'),
            ).toBeVisible();

            await expect(page.getByText('Please copy your new API token.')).toBeVisible();
            await page.getByTestId('close-api-token').click();

            await expect(page.getByText('Manage API Tokens')).toBeVisible();

            await expect(
                page.getByTestId('api-tokens').locator('..').getByText('A Token'),
            ).toBeVisible();
        });

        test('updates permissions of a token', async ({ page }: { page: Page }) => {
            createToken(page, 'A Token');

            await page.getByTestId('permissions-button').click();

            await expect(
                page.getByTestId('api-token-permissions-modal').locator('input:checked'),
            ).toHaveCount(1);

            await page.getByTestId('api-token-permissions-modal').locator('#create').check();

            await page.getByTestId('save-permissions').click();

            await page.getByTestId('permissions-button').click();

            await expect(
                page.getByTestId('api-token-permissions-modal').locator('input:checked'),
            ).toHaveCount(2);
        });

        test('deletes a token', async ({ page }: { page: Page }) => {
            createToken(page, 'A Token');

            await expect(page.getByText('Manage API Tokens')).toBeVisible();

            await page.getByTestId('delete-button').click();

            await expect(
                page.getByText('Are you sure you would like to delete this API token?'),
            ).toBeVisible();

            await page.getByTestId('delete-confirm-button').click();

            await expect(page.getByText('Manage API Tokens')).toHaveCount(0);
        });
    });
});
