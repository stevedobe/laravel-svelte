import { faker } from '@faker-js/faker';

export const fakePerson = () => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    return {
        name: faker.person.fullName({
            firstName: firstName,
            lastName: lastName,
        }),
        email: faker.internet.email({
            firstName: firstName.toLowerCase(),
            lastName: lastName.toLowerCase(),
        }),
        password: faker.internet.password(),
    };
};

/**
 * Get the title of the page.
 */
export const pageTitle = (title = '') =>
    title ? `${title} | ${Cypress.env('appName')}` : Cypress.env('appName');
