<?php

namespace SteveDobe\LaravelSvelte\Concerns;

use Exception;
use Symfony\Component\Finder\Finder;

trait UpdatesFiles
{
    /**
     * Handle updating the application's files.
     */
    protected function updateFiles(): bool
    {
        try {
            $this->components->info('Copying required files...');

            $starterKit = $this->starterKit();
            $hasSsr = $this->hasSsr();

            $this->cleanInertiaMiddleware($starterKit);
            $this->cleanAppBlade();
            $this->cleanTailwindConfig();
            $this->cleanViteConfig($hasSsr);
            $this->cleanAppJs($hasSsr);
            $this->cleanSsrJs($hasSsr);
            $this->replaceViewsWithSvelte($starterKit, $hasSsr);
            $this->applyFeatureSpecificUpdates($starterKit);

            $this->components->info('Required files copied.');

            return true;
        } catch (Exception $e) {
            $this->components->error($e->getMessage());

            return false;
        }
    }

    /**
     * Determine which start kit is installed, Breeze or Jetstream.
     */
    protected function starterKit(): string
    {
        if ($this->hasComposerPackage('laravel/jetstream')) {
            return 'jetstream';
        }

        if ($this->hasComposerPackage('laravel/breeze')) {
            return 'breeze';
        }

        throw new Exception('Neither Laravel Breeze nor Laravel Jetstream is installed.');
    }

    /**
     * Add appName for the Helmet component and currentRouteName in favour of Ziggy.
     */
    protected function cleanInertiaMiddleware(string $starterKit): void
    {
        $middlewarePath = base_path('app/Http/Middleware/HandleInertiaRequests.php');

        $this->replaceInFile(
            searchFor: 'use Illuminate\Http\Request;',
            replaceWith: 'use Illuminate\Http\Request;'.PHP_EOL.'use Illuminate\Support\Facades\Route;',
            filePath: $middlewarePath
        );

        $this->removeLinesContainingString($middlewarePath, 'use Tighten\Ziggy\Ziggy');

        $searchFor = "/public function share[\s\S]+?\}/";

        if ($starterKit === 'breeze') {
            $this->replaceInFile(
                searchFor: $searchFor,
                replaceWith: 'public function share(Request $request): array'
                    .PHP_EOL.'    {'
                    .PHP_EOL.'        return ['
                    .PHP_EOL.'            ...parent::share($request),'
                    .PHP_EOL."            'auth' => ["
                    .PHP_EOL.'                \'user\' => $request->user(),'
                    .PHP_EOL.'            ],'
                    .PHP_EOL."            'webtend' => ["
                    .PHP_EOL."                'appName' => config('app.name'),"
                    .PHP_EOL."                'currentRouteName' => Route::currentRouteName(),"
                    .PHP_EOL.'            ],'
                    .PHP_EOL.'        ];'
                    .PHP_EOL.'    }',
                filePath: $middlewarePath,
                regex: true
            );
        } else {
            $this->replaceInFile(
                searchFor: $searchFor,
                replaceWith: 'public function share(Request $request): array'
                    .PHP_EOL.'    {'
                    .PHP_EOL.'        return ['
                    .PHP_EOL.'            ...parent::share($request),'
                    .PHP_EOL."            'webtend' => ["
                    .PHP_EOL."                'appName' => config('app.name'),"
                    .PHP_EOL."                'currentRouteName' => Route::currentRouteName(),"
                    .PHP_EOL.'            ],'
                    .PHP_EOL.'        ];'
                    .PHP_EOL.'    }',
                filePath: $middlewarePath,
                regex: true
            );
        }
    }

    /**
     * Clean the application's app.blade.php.
     */
    protected function cleanAppBlade(): void
    {
        $appBladePath = resource_path('views/app.blade.php');

        $this->removeLinesContainingString($appBladePath, '<title inertia>');
        $this->removeLinesContainingString($appBladePath, '@routes');

        $this->replaceInFile(
            searchFor: '/@vite\(\[[\s\S]+?\]\)/',
            replaceWith: "@vite('resources/js/app.ts')",
            filePath: $appBladePath,
            regex: true
        );

        $this->replaceConsecutiveBlankLinesWithOneLine($appBladePath);
    }

    /**
     * Clean the application's tailwind.config.js.
     */
    protected function cleanTailwindConfig(): void
    {
        $tailwindConfigPath = base_path('tailwind.config.js');

        $this->removeLinesContainingString($tailwindConfigPath, './vendor/laravel/');

        $this->replaceInFile(
            searchFor: './resources/js/**/*.vue',
            replaceWith: './resources/js/**/*.svelte',
            filePath: $tailwindConfigPath
        );
    }

    /**
     * Clean the application's vite.config.js.
     */
    protected function cleanViteConfig(bool $hasSsr): void
    {
        $viteConfigPath = base_path('vite.config.js');

        $this->replaceInFile(
            searchFor: 'import laravel',
            replaceWith: "import { svelte } from '@sveltejs/vite-plugin-svelte';".PHP_EOL.'import laravel',
            filePath: $viteConfigPath
        );

        $this->removeLinesContainingString($viteConfigPath, 'import vue from ');

        $this->replaceInFile(
            searchFor: '/vue\(\{[\s\S]+?\}\)/',
            replaceWith: $hasSsr
                ? 'svelte({'
                    .PHP_EOL.'            compilerOptions: {'
                    .PHP_EOL.'                hydratable: true,'
                    .PHP_EOL.'            },'
                    .PHP_EOL.'        })'
                : 'svelte()',
            filePath: $viteConfigPath,
            regex: true
        );

        $this->replaceInFile(
            searchFor: 'app.js',
            replaceWith: 'app.ts',
            filePath: $viteConfigPath
        );

        if ($hasSsr) {
            $this->replaceInFile(
                searchFor: 'ssr.js',
                replaceWith: 'ssr.ts',
                filePath: $viteConfigPath
            );
        }
    }

    /**
     * Clean the application's app.js.
     *
     * The changes are enough to simply replace the file from stubs.
     */
    protected function cleanAppJs(bool $hasSsr): void
    {
        $this->filesystem->delete(resource_path('js/app.js'));

        $stubPath = $hasSsr
            ? 'shared/typescript/resources/js/app-ssr.ts'
            : 'shared/typescript/resources/js/app.ts';

        $this->copyStub($stubPath, resource_path('js/app.ts'));
    }

    /**
     * Clean the application's ssr.js.
     *
     * The changes are enough to simply replace the file from stubs.
     */
    protected function cleanSsrJs(bool $hasSsr): void
    {
        if (! $hasSsr) {
            return;
        }

        $this->filesystem->delete(resource_path('js/ssr.js'));

        $this->copyStub('shared/typescript/resources/js/ssr.ts', resource_path('js/ssr.ts'));
    }

    /**
     * Replace the views with Svelte.
     */
    protected function replaceViewsWithSvelte(string $starterKit, bool $hasSsr): void
    {
        // Ensure you check for dark mode before files are updated.
        $hasDarkMode = $this->hasDarkMode();

        // Copy shared files.
        $this->replaceViewsWithSvelteFromDirectory('shared/typescript/resources/js/');

        // Copy files specific to the Starter Kit installed.
        $this->replaceViewsWithSvelteFromDirectory($starterKit.'/typescript/resources/js/');

        if ($starterKit === 'breeze') {
            $this->filesystem->deleteDirectory(resource_path('js/types'));
        }

        if (! $hasDarkMode) {
            $this->removeDarkClasses();
        }

        if ($hasSsr) {
            $this->appendToFile(resource_path('js/Types/app.d.ts'), [
                "declare module '@inertiajs/svelte/server';",
                '',
            ]);
        }
    }

    /**
     * Replace the views with Svelte from a given directory.
     */
    protected function replaceViewsWithSvelteFromDirectory(string $resourcesJsDirectory): void
    {
        $directories = $this->allDirectories($this->stubs($resourcesJsDirectory));

        foreach ($directories as $directory) {
            $this->filesystem->ensureDirectoryExists(resource_path('js/'.$directory));

            $this->filesystem->copyDirectory(
                $this->stubs($resourcesJsDirectory.$directory),
                resource_path('js/'.$directory)
            );

            $files = glob(resource_path('js/'.$directory.'/*.vue'));

            if (is_array($files)) {
                $this->filesystem->delete($files);
            }
        }
    }

    /**
     * Apply feature specific updates.
     */
    protected function applyFeatureSpecificUpdates(string $starterKit): void
    {
        $this->filesystem->delete(base_path('jsconfig.json'));

        $this->copyStub('shared/svelte/svelte.config.js', base_path('svelte.config.js'));
        $this->copyStub('shared/typescript/tsconfig.json', base_path('tsconfig.json'));

        rename(resource_path('js/bootstrap.js'), resource_path('js/bootstrap.ts'));

        $features = [
            'eslint' => function () {
                $this->copyStub('shared/eslint/eslint.config.js', base_path('eslint.config.js'));
            },
            'prettier' => function () {
                $this->copyStub('shared/prettier/.prettierignore', base_path('.prettierignore'));
                $this->copyStub('shared/prettier/.prettierrc.json', base_path('.prettierrc.json'));
            },
            'cypress' => function () use ($starterKit) {
                $this->handleCypressRoutes();
                $this->handleCypressEnvironment();
                $this->handleCypressTests($starterKit);
                $this->handleCypressConfig($starterKit);

                if ($this->option('eslint')) {
                    $this->handleCypressEslintConfig();
                }
            },
        ];

        foreach ($features as $feature => $action) {
            if ($this->option($feature)) {
                $action();
            }
        }
    }

    /**
     * Handle the Cypress routes.
     */
    protected function handleCypressRoutes(): void
    {
        $this->appendToFile(base_path('routes/web.php'), [
            '',
            "if (getenv('APP_ENV') === 'testing') {",
            "    require __DIR__.'/testing.php';",
            '}',
            '',
        ]);

        $this->copyStub('shared/cypress/routes/testing.php', base_path('routes/testing.php'));
    }

    /**
     * Handle the Cypress environment.
     */
    protected function handleCypressEnvironment(): void
    {
        copy(base_path('.env'), base_path('.env.testing'));

        $this->replaceInFile(
            searchFor: 'APP_ENV=local',
            replaceWith: 'APP_ENV=testing',
            filePath: base_path('.env.testing')
        );

        $this->replaceInFile(
            searchFor: 'APP_DEBUG=true',
            replaceWith: 'APP_DEBUG=false',
            filePath: base_path('.env.testing')
        );
    }

    /**
     * Handle the Cypress tests.
     */
    protected function handleCypressTests(string $starterKit): void
    {
        $this->filesystem->copyDirectory($this->stubs('shared/cypress/tests'), base_path('tests'));

        if ($this->filesystem->exists($this->stubs($starterKit.'/cypress/tests'))) {
            $this->filesystem->copyDirectory($this->stubs($starterKit.'/cypress/tests'), base_path('tests'));
        }

        if ($starterKit === 'breeze') {
            $this->replaceInFile(
                searchFor: '/email/verify',
                replaceWith: '/verify-email',
                filePath: base_path('tests/Cypress/e2e/Auth/Register.cy.ts')
            );
        }

        if ($starterKit === 'jetstream' && \Laravel\Jetstream\Features::hasTeamFeatures()) {
            $this->copyStub('shared/cypress/database/seeders/TeamsTestSeeder.php', base_path('database/seeders/TeamsTestSeeder.php'));
        }

        $this->appendToFile(base_path('.gitignore'), [
            '.env.testing',
            '/tests/Cypress/downloads',
            '/tests/Cypress/screenshots',
            '/tests/Cypress/videos',
            '',
        ]);
    }

    /**
     * Handle the Cypress config.
     */
    protected function handleCypressConfig(string $starterKit): void
    {
        $cypressConfig = base_path('cypress.config.ts');

        $this->copyStub($starterKit.'/cypress/cypress.config.ts', $cypressConfig);

        if ($starterKit === 'jetstream') {
            $this->alignCypressConfigToEnabledFeatures($cypressConfig);
        }
    }

    /**
     * Handle the Cypress Eslint config.
     */
    protected function handleCypressEslintConfig(): void
    {
        $eslintConfigPath = base_path('eslint.config.js');

        $this->replaceInFile(
            searchFor: 'import globals',
            replaceWith: "import cypress from 'eslint-plugin-cypress/flat';".PHP_EOL.'import globals',
            filePath: $eslintConfigPath
        );

        $this->replaceInFile(
            searchFor: "'storage/',",
            replaceWith: "'storage/',".PHP_EOL."            'tests/Cypress/',",
            filePath: $eslintConfigPath
        );

        $this->replaceInFile(
            searchFor: "...svelte.configs['flat/recommended'],",
            replaceWith: "...svelte.configs['flat/recommended'],".PHP_EOL.'    cypress.configs.recommended,',
            filePath: $eslintConfigPath
        );

        $this->copyStub('shared/cypress/eslint.config.d.ts', base_path('eslint.config.d.ts'));
    }

    /**
     * Align the Cypress config to the enabled features.
     */
    protected function alignCypressConfigToEnabledFeatures(string $cypressConfig): void
    {
        $features = [
            \Laravel\Fortify\Features::registration() => 'registration',
            \Laravel\Fortify\Features::resetPasswords() => 'resetPasswords',
            \Laravel\Fortify\Features::emailVerification() => 'emailVerification',
            \Laravel\Fortify\Features::updateProfileInformation() => 'updateProfileInformation',
            \Laravel\Fortify\Features::updatePasswords() => 'updatePasswords',
            \Laravel\Fortify\Features::twoFactorAuthentication() => 'twoFactorAuthentication',
            \Laravel\Jetstream\Features::termsAndPrivacyPolicy() => 'termsAndPrivacyPolicy',
            \Laravel\Jetstream\Features::api() => 'api',
            \Laravel\Jetstream\Features::teams() => 'teams',
            \Laravel\Jetstream\Features::accountDeletion() => 'accountDeletion',
        ];

        foreach ($features as $key => $feature) {
            if (\Laravel\Fortify\Features::enabled((string) $key) || \Laravel\Jetstream\Features::enabled((string) $key)) {
                $this->replaceInFile(
                    searchFor: $feature.': false',
                    replaceWith: $feature.': true',
                    filePath: $cypressConfig
                );
            }
        }
    }

    /**
     * Get all directories in a given directory.
     *
     * @return array<string>
     */
    protected function allDirectories(string $directory): array
    {
        $directories = [];

        foreach ((new Finder)->create()->in($directory)->directories()->depth('>= 0')->sortByName() as $dir) {
            $directories[] = $dir->getRelativePathname();
        }

        return $directories;
    }

    /**
     * Append lines to a file.
     *
     * @param  array<string>  $lines
     */
    protected function appendToFile(string $file, array $lines): void
    {
        file_put_contents($file, implode(PHP_EOL, $lines), FILE_APPEND);
    }

    /**
     * Determine if the current Laravel installation has Dark Mode.
     */
    protected function hasDarkMode(): bool
    {
        $files = (new Finder)
            ->in(resource_path('js'))
            ->name('*.vue')
            ->notPath('Pages/Welcome.vue')
            ->contains('/class="[^"]*dark:[^"]*"/');

        return $files->count() > 0;
    }

    /**
     * Determine if the current Laravel installation has Server Side Rendering.
     */
    protected function hasSsr(): bool
    {
        return file_exists(resource_path('js/ssr.js')) || file_exists(resource_path('js/ssr.ts'));
    }

    /**
     * Remove dark classes from the application.
     */
    protected function removeDarkClasses(): void
    {
        $files = (new Finder)
            ->in(resource_path('js'))
            ->name('*.svelte')
            ->notPath('Pages/Welcome.svelte');

        foreach ($files as $file) {
            $this->replaceInFile(
                searchFor: '/\sdark:[^\s"\']+/',
                replaceWith: '',
                filePath: $file,
                regex: true
            );
        }
    }

    /**
     * Remove lines from a file that contain a given string.
     */
    protected function removeLinesContainingString(string $filePath, string $search): void
    {
        if (! file_exists($filePath)) {
            return;
        }

        $file = file($filePath);

        if (! is_array($file)) {
            return;
        }

        $newFile = [];

        foreach ($file as $line) {
            if (! str_contains($line, $search)) {
                $newFile[] = $line;
            }
        }

        file_put_contents($filePath, implode('', $newFile));
    }

    /**
     * Replace consecutive blank lines with one line.
     */
    protected function replaceConsecutiveBlankLinesWithOneLine(string $filePath): void
    {
        if (! file_exists($filePath)) {
            return;
        }

        $this->replaceInFile(
            searchFor: "/(\n){3,}/",
            replaceWith: "\n\n",
            filePath: $filePath,
            regex: true
        );

        $this->replaceInFile(
            searchFor: "/(\r\n){3,}/",
            replaceWith: "\r\n\r\n",
            filePath: $filePath,
            regex: true
        );
    }

    /**
     * Replace a string or regular expression in a file.
     */
    protected function replaceInFile(string $searchFor, string $replaceWith, string $filePath, bool $regex = false): void
    {
        if (! file_exists($filePath)) {
            return;
        }

        $contents = $this->fileAsString($filePath);

        $contents = $regex
            ? preg_replace($searchFor, $replaceWith, $contents)
            : str_replace($searchFor, $replaceWith, $contents);

        file_put_contents($filePath, $contents);
    }

    /**
     * Copy a file from the stub directory to a destination path.
     */
    protected function copyStub(string $stubPath, string $destinationPath): void
    {
        copy($this->stubs($stubPath), $destinationPath);
    }

    /**
     * Get the stub path.
     */
    protected function stubs(string $path): string
    {
        return __DIR__.'/../../stubs/'.$path;
    }
}
