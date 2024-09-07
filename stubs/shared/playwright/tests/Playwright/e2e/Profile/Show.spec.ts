import { test, expect, type Page } from '@playwright/test';
import { config, pageTitle, login, logout } from './../helpers';

test.describe('Profile', () => {
    test.describe('Permissions', () => {
        test('forbids guests', async ({ page }: { page: Page }) => {
            await logout(page);

            await page.goto(config.profileRoute);

            await expect(page).toHaveURL('/login');
        });

        test('allows authorised users', async ({ page }: { page: Page }) => {
            await login(page);

            await page.goto(config.profileRoute);

            await expect(page).toHaveURL(config.profileRoute);
        });
    });

    test.describe('The Page', () => {
        test.beforeEach(async ({ page }) => {
            await login(page);

            await page.goto(config.profileRoute);
        });

        test('has the correct title', async ({ page }: { page: Page }) => {
            expect(await page.title()).toBe(pageTitle('Profile'));
        });

        test('updates the Profile Information', async ({ page }: { page: Page }) => {
            if (!config.features.updateProfileInformation) {
                await expect(
                    page.getByRole('heading', { name: 'Profile Information' }),
                ).toHaveCount(0);

                return;
            }

            await expect(page.getByRole('heading', { name: 'Profile Information' })).toBeVisible();

            await page.getByLabel('Name').fill('Some Other Name');

            await page.getByTestId('profile-information-button').click();

            await expect(
                page.getByTestId('profile-information-button').locator('..').getByText('Saved.'),
            ).toBeVisible();
        });

        test('updates the password', async ({ page }: { page: Page }) => {
            if (!config.features.updatePasswords) {
                await expect(page.getByRole('heading', { name: 'Update Password' })).toHaveCount(0);

                return;
            }

            await expect(page.getByRole('heading', { name: 'Update Password' })).toBeVisible();

            await page.getByLabel('Current Password').fill('password');
            await page.getByLabel('New Password').fill('another-password');
            await page.getByLabel('Confirm Password').fill('another-password');

            await page.getByTestId('update-password-button').click();

            await expect(
                page.getByTestId('update-password-button').locator('..').getByText('Saved.'),
            ).toBeVisible();
        });

        test('enables two factor authentication', async ({ page }: { page: Page }) => {
            if (!config.features.twoFactorAuthentication) {
                await expect(
                    page.getByRole('heading', { name: 'Two Factor Authentication', exact: true }),
                ).toHaveCount(0);

                return;
            }

            await expect(
                page.getByRole('heading', { name: 'Two Factor Authentication', exact: true }),
            ).toBeVisible();

            await page.getByTestId('two-factor-authentication-button').click();

            await page.getByTestId('confirms-password-form-password').fill('password');
            await page.keyboard.press('Enter');

            await expect(page.getByText('Setup Key:')).toBeVisible();
        });

        test('logs out other browser sessions if the feature is enabled', async ({
            page,
        }: {
            page: Page;
        }) => {
            if (!config.features.logsOutOtherBrowserSessions) {
                await expect(page.getByRole('heading', { name: 'Browser Sessions' })).toHaveCount(
                    0,
                );

                return;
            }

            await expect(page.getByRole('heading', { name: 'Browser Sessions' })).toBeVisible();

            await page.getByTestId('logout-other-browser-sessions-button').click();

            await page.getByTestId('logout-other-browser-sessions-form-password').fill('password');
            await page.keyboard.press('Enter');

            await expect(page.getByText('Done.')).toBeVisible();
        });

        test('delete the account if the feature is enabled', async ({ page }: { page: Page }) => {
            if (!config.features.accountDeletion) {
                await expect(page.getByRole('heading', { name: 'Delete Account' })).toHaveCount(0);

                return;
            }

            await expect(page.getByRole('heading', { name: 'Delete Account' })).toBeVisible();

            await page.getByTestId('delete-account-button').click();

            await page.getByTestId('delete-user-form-password').fill('password');
            await page.keyboard.press('Enter');

            await expect(page).toHaveURL('/');
        });
    });
});
