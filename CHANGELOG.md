# Changelog

All notable changes to `Laravel Svelte` will be documented in this file.

## Version 1.8.0

### Added

-   Svelte 5 syntax and reactivity support, applying runes where applicable.

## Version 1.7.1

### Added

-   Bumped illuminate/support

## Version 1.7.0

### Added

-   Updated NPM packages to Svelte 5 and Vite 6. The Svelte files remain with v4 syntax and will be migrated soon.

## Version 1.6.2

### Fixed

-   Spelling mistake lang="ts"

## Version 1.6.1

### Fixed

-   tailwindcss() must come after svelte() in vite.config.js.

## Version 1.6.0

### Added
-   Breeze 2.3
-   Update Composer and NPM packages.
    -   Still need to update to Svelte 5 and Vite 6. Coming soon...

## Version 1.5.0

### Added
-   Breeze 2.2
-   Jetstream 5.3

## Version 1.4.0

### Added
-   Jetstream 5.2

## Version 1.3.0

### Added
-   Updated Node dependencies, notably:
    -   eslint to v9
    -   svelte-check to v4
    -   typescript-eslint to v8

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
