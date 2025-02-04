describe('Logging Out', () => {
    beforeEach(() => {
        cy.login().visit('/dashboard');
    });

    it('succeeds when clicking on the Log out link', () => {
        // Restrict to visible only so that it chooses either the desktop or mobile menu.
        cy.getByTestId('user-menu').filter(':visible').click();

        cy.contains('Log Out').click();

        cy.location('pathname').should('eq', '/');

        cy.currentUser().then((user) => {
            return expect(user.email).to.be.undefined;
        });
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
