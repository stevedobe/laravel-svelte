# Changelog

All notable changes to `Laravel Svelte` will be documented in this file.

## Version 1.2.0

### Added
-   Added Playwright testing as an installation option
-   Added faker-js to create people rather than migrate:fresh for performance
-   Only create Api and Teams tests if options are selected with Jetstream
-   Replace data-cy with data-testid so more generic for Cypress and Playwright
-   Added TestingController now that we are doing more
-   Removed TeamsTestSeeder in favour of faker-js

## Version 1.1.0

### Added
-   Namespace inertia props

## Version 1.0.1

### Fixed
-   Fix InertiaMiddleware without SSR

## Version 1.0.0

### Added
-   This is Laravel Svelte's first public release.
