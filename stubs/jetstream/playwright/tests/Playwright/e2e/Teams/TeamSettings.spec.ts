import { test, expect, type Page } from '@playwright/test';
import { config, create, login, logout, pageTitle } from './../helpers';

interface Team {
    id?: number;
    name?: string;
    personal_team?: boolean;
    user_id?: number;
}

interface User {
    id?: number;
    name?: string;
    email?: string;
    current_team_id?: number;
}

async function createTeamOwner(page: Page): Promise<User> {
    return (await create(page, 'App\\Models\\User')) as User;
}

async function createTeamAndAssignOwner(page: Page, owner: User): Promise<Team> {
    return (await create(page, 'App\\Models\\Team', {
        user_id: owner.id,
        personal_team: false,
    })) as Team;
}

async function createTeamMember(page: Page, team: Team): Promise<User> {
    return (await create(page, 'App\\Models\\User', {
        current_team_id: team.id,
    })) as User;
}

test.describe('Team Settings', () => {
    test.describe('Feature Check', () => {
        test('does not render the page if the feature is disabled', async ({
            page,
        }: {
            page: Page;
        }) => {
            if (!config.features.teams) {
                const teamOwner = await createTeamOwner(page);
                const team = await createTeamAndAssignOwner(page, teamOwner);

                await login(page, { id: teamOwner.id });

                const response = await page.request.get(`/teams/${team.id}`);

                expect(response.status()).toBe(404);
            }
        });
    });

    if (!config.features.teams) {
        return;
    }

    test.describe('Permissions', () => {
        test('forbids guests', async ({ page }: { page: Page }) => {
            const teamOwner = await createTeamOwner(page);
            const team = await createTeamAndAssignOwner(page, teamOwner);

            await logout(page);

            await page.goto(`/teams/${team.id}`);

            await expect(page).toHaveURL('/login');
        });

        test('allows the owner of the team', async ({ page }: { page: Page }) => {
            const teamOwner = await createTeamOwner(page);
            const team = await createTeamAndAssignOwner(page, teamOwner);

            await login(page, { id: teamOwner.id });

            await page.goto(`/teams/${team.id}`);

            await expect(page).toHaveURL(`/teams/${team.id}`);
        });

        test('forbids members of the team', async ({ page }: { page: Page }) => {
            const teamOwner = await createTeamOwner(page);
            const team = await createTeamAndAssignOwner(page, teamOwner);
            const teamMember = await createTeamMember(page, team);

            await login(page, { id: teamMember.id });

            const response = await page.request.get(`/teams/${team.id}`);

            expect(response.status()).toBe(403);
        });

        test('forbids users that are not a member of the team', async ({
            page,
        }: {
            page: Page;
        }) => {
            const teamOwner = await createTeamOwner(page);
            const team = await createTeamAndAssignOwner(page, teamOwner);

            await login(page);

            const response = await page.request.get(`/teams/${team.id}`);

            expect(response.status()).toBe(403);
        });
    });

    test.describe('The Page', () => {
        test.beforeEach(async ({ page }) => {
            const teamOwner = await createTeamOwner(page);
            const team = await createTeamAndAssignOwner(page, teamOwner);

            await login(page, { id: teamOwner.id });

            await page.goto(`/teams/${team.id}`);
        });

        test('has the correct title', async ({ page }: { page: Page }) => {
            expect(await page.title()).toBe(pageTitle('Team Settings'));
        });

        test('updates the team name', async ({ page }: { page: Page }) => {
            await page.getByLabel('Name').fill('Another team name');

            await page.getByTestId('save-button').click();

            await expect(page.getByText('Saved.')).toBeVisible();
        });

        test('adds a team member', async ({ page }: { page: Page }) => {
            await expect(page.getByText('Add Team Member')).toBeVisible();

            await page.getByLabel('Email').fill('someone@example.com');

            await page.getByTestId('editor-button').click();
            await page.getByTestId('add-button').click();

            await expect(page.getByText('someone@example.com')).toBeVisible();
        });
    });
});
