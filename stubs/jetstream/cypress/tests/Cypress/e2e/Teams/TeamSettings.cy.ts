import { pageTitle } from './../helpers';

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

describe('Team Settings', () => {
    const env = Cypress.env();

    let team: Team;
    let teamMember: User;
    let teamOwner: User;

    before(() => {
        // Create the team owner.
        cy.create('App\\Models\\User').then((ownerResponse) => {
            teamOwner = ownerResponse;

            // Create the team and assign the owner.
            cy.create('App\\Models\\Team', {
                user_id: teamOwner.id,
                personal_team: false,
            }).then((teamResponse) => {
                team = teamResponse;

                // Create a team member.
                cy.create('App\\Models\\User', {
                    current_team_id: team.id,
                }).then((memberResponse) => {
                    teamMember = memberResponse;
                });
            });
        });
    });

    context('Feature Check', () => {
        it('does not render the page if the feature is disabled', () => {
            if (!env.features.teams) {
                cy.login({ id: teamOwner.id });

                cy.request({
                    url: `/teams/${team.id}`,
                    failOnStatusCode: false,
                }).then((response) => {
                    expect(response.status).to.eq(404);
                });
            }
        });
    });

    if (!env.features.teams) {
        return;
    }

    context('Permissions', () => {
        it('forbids guests', () => {
            cy.logout().visit(`/teams/${team.id}`);

            cy.location('pathname').should('eq', '/login');
        });

        it('allows the owner of the team', () => {
            cy.login({ id: teamOwner.id }).visit(`/teams/${team.id}`);

            cy.location('pathname').should('eq', `/teams/${team.id}`);
        });

        it('forbids members of the team', () => {
            cy.login({ id: teamMember.id });

            cy.request({
                url: `/teams/${team.id}`,
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(403);
            });
        });

        it('forbids users that are not a member of the team', () => {
            cy.login();

            cy.request({
                url: `/teams/${team.id}`,
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(403);
            });
        });
    });

    context('The Page', () => {
        beforeEach(() => {
            cy.login({ id: teamOwner.id }).visit(`/teams/${team.id}`);
        });

        it('has the correct title', () => {
            cy.title().should('eq', pageTitle('Team Settings'));
        });

        it('updates the team name', () => {
            cy.contains('Team Name');

            cy.get('#name').clear();
            cy.get('#name').type('Another team name');

            cy.getByTestId('save-button').click();

            cy.contains('Saved.');
        });

        it('adds a team member', () => {
            cy.intercept('POST', `/teams/${team.id}/members`).as('addTeamMember');

            cy.contains('Add Team Member');

            cy.get('#email').clear();
            cy.get('#email').type('someone@example.com');

            cy.getByTestId('editor-button').click();

            cy.getByTestId('add-button').click();

            cy.wait('@addTeamMember');

            cy.contains('Added.');
        });
    });
});
