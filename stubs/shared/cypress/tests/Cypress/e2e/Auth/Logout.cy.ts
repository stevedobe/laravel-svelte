describe('Logging Out', () => {
    beforeEach(() => {
        cy.login().visit('/dashboard');
    });

    it('succeeds when clicking on the Log out link', () => {
        cy.get('[data-cy=user-menu]').click();

        cy.contains('Log Out').click();

        cy.location('pathname').should('eq', '/');
    });

    it('fails with a GET request to /logout', () => {
        cy.request({
            method: 'GET',
            url: '/logout',
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(405); // Method not allowed
        });
    });
});
