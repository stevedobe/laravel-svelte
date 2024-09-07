# Laravel Svelte

[![Latest Version on Packagist][ico-version]][link-packagist]
[![Total Downloads][ico-downloads]][link-downloads]

This package replaces Vue with [Svelte](https://svelte.dev/) and [Typescript](https://www.typescriptlang.org/) support in a fresh Laravel Breeze or Laravel Jetstream installation and optionally adds [Eslint](https://eslint.org/), [Prettier](https://prettier.io/), and [Cypress](https://www.cypress.io/) or [Playwright](https://playwright.dev/).

I only intended Laravel Svelte for fresh Laravel Breeze or Laravel Jetstream installations with Inertia and Vue. Because of this, I will continue implementing changes made to Breeze and Jetstream into this package to remain in sync with Laravel installations.

This package will respect and keep in place any of the options provided to or excluded from your installation, such as dark mode, Pest, SSR and Teams support.

However, two opinionated changes occur to your Laravel installation:
-   It installs TypeScript. You may choose to remove it, but please consider the value it provides.
-   It removes [Ziggy](https://github.com/tighten/ziggy). You may reinstall it if you like.

## Installation

First, install a fresh copy of Laravel Breeze or Laravel Jetstream with Inertia and Vue.

-   [Laravel Breeze](https://laravel.com/docs/11.x/starter-kits) with Inertia and Vue

```bash
composer create-project laravel/laravel example-app

cd example-app

composer require laravel/breeze --dev

php artisan breeze:install vue [--dark] [--pest] [--ssr] [--typescript]
```

-   [Laravel Jetstream](https://jetstream.laravel.com/installation.html) with Inertia

```bash
composer create-project laravel/laravel example-app

cd example-app

composer require laravel/jetstream

php artisan jetstream:install inertia [--dark] [--teams] [--api] [--verification] [--pest] [--ssr]
```

Then, install Laravel Svelte via Composer

```bash
composer require stevedobe/laravel-svelte
```

## Usage

If you wish to know exactly what this package changes to a Laravel installation, create a Git repository for your project now with an initial commit.

### Optional Step

You may publish Laravel Svelte's configuration file to config/laravel-svelte.php and modify it as needed. I can only think of two reasons why you may want to do this:

-   Your Laravel installation is not running Breeze 2.1 or Jetstream 5.1.
    -   Laravel Svelte is bound to, and may only work for, specific versions of Breeze and Jetstream. It currently supports the abovementioned versions. If you are running a different version of Breeze or Jetstream, you need to change the **compatibleWith** settings in Laravel Svelte's configuration file. If your version of Breeze or Jetstream does not match the corresponding **compatibleWith** version, the package will throw an exception.

-   You want to control the versions of the installed Node packages. These are listed in the configuration file.

```sh
php artisan vendor:publish --provider="SteveDobe\LaravelSvelte\LaravelSvelteServiceProvider"
```

### Execute

To swap out Vue with Svelte, run the following command. You will be prompted to optionally install Eslint, Prettier and Cypress or Playwright.

```sh
php artisan stevedobe:swap-vue-with-svelte
```

## Notes

-   Helpers have been added to package.json to aid in formatting, checking and testing your application. Feel free to modify or remove any of these.
-   If you have based your project on Laravel Jetstream and you have installed Cypress, ensure you keep the features in cypress.config.js in sync with config/fortify.php and config/jetstream.php.
-   If you have based your project on Laravel Jetstream and you have installed Playwright, ensure you keep the features in tests/Playwright/e2e/helpers.ts in sync with config/fortify.php and config/jetstream.php.
-   If you have installed Cypress, you may need to change the port number of the baseUrl in cypress.config.js. Watch for what port ***php artisan serve*** has provided.
-   If you have installed Playwright, you may need to change the port number of the baseUrl in playwright.config.ts. Watch for what port ***php artisan serve*** has provided.

## Change log

Please see the [changelog](CHANGELOG.md) for more information on what has changed recently.

## Contributing

Please see [contributing.md](CONTRIBUTING.md) for details.

## Security

If you discover any security-related issues, please email steve.dobe@webtend.com.au instead of using the issue tracker.

## Credits

- [Steve Dobe][link-author]
- [All Contributors][link-contributors]

## License

MIT. Please see the [license file](LICENSE.md) for more information.

[ico-version]: https://img.shields.io/packagist/v/stevedobe/laravel-svelte.svg?style=flat-square
[ico-downloads]: https://img.shields.io/packagist/dt/stevedobe/laravel-svelte.svg?style=flat-square
[ico-travis]: https://img.shields.io/travis/stevedobe/laravel-svelte/master.svg?style=flat-square
[ico-styleci]: https://styleci.io/repos/12345678/shield

[link-packagist]: https://packagist.org/packages/stevedobe/laravel-svelte
[link-downloads]: https://packagist.org/packages/stevedobe/laravel-svelte
[link-travis]: https://travis-ci.org/stevedobe/laravel-svelte
[link-styleci]: https://styleci.io/repos/12345678
[link-author]: https://github.com/stevedobe
[link-contributors]: ../../contributors
