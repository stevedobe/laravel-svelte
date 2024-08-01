<?php

namespace SteveDobe\LaravelSvelte\Concerns;

use Exception;
use JsonException;

trait ManagesNodePackages
{
    /**
     * Handle updating package.json.
     */
    protected function updatePackageJson(): bool
    {
        $packagePath = base_path('package.json');

        try {
            $this->components->info('Updating Node packages (package.json)...');

            $packageJson = $this->readPackageJson($packagePath);

            $packageJson['devDependencies'] = $this->addSvelteNodePackages($packageJson['devDependencies']);
            $packageJson['devDependencies'] = $this->removeVueNodePackages($packageJson['devDependencies']);
            $packageJson['scripts'] = $this->addNodeScripts($packageJson['scripts']);

            $this->writePackageJson($packagePath, $packageJson);

            $this->components->info('Node packages added successfully.');

            return true;
        } catch (JsonException $e) {
            $this->components->error('Invalid JSON in package.json file: '.$e->getMessage());

            return false;
        } catch (Exception $e) {
            $this->components->error('Could not update package.json file: '.$e->getMessage());

            return false;
        }
    }

    /**
     * Read the package.json file.
     *
     * @return array{
     *      scripts: array<string, string>,
     *      devDependencies: array<string, string>
     * }
     */
    protected function readPackageJson(string $packagePath): array
    {
        $json = $this->fileAsJson($packagePath);

        if (! array_key_exists('devDependencies', $json)) {
            $json['devDependencies'] = [];
        }

        if (! array_key_exists('scripts', $json)) {
            $json['scripts'] = [];
        }

        return $json;
    }

    /**
     * Add the required node packages depending on the options chosen.
     *
     * @param  array<string, string>  $devDependencies
     * @return array<string, string>
     */
    protected function addSvelteNodePackages(array $devDependencies): array
    {
        // Install Svelte and Typescript packages regardless of the options chosen.
        $devDependencies = $this->addPackages($devDependencies, 'base');

        if ($this->option('eslint')) {
            $devDependencies = $this->addPackages($devDependencies, 'eslint');

            if ($this->option('cypress')) {
                $devDependencies = $this->addPackages($devDependencies, 'eslint.cypress');
            }

            if ($this->option('prettier')) {
                $devDependencies = $this->addPackages($devDependencies, 'eslint.prettier');
            }
        }

        if ($this->option('prettier')) {
            $devDependencies = $this->addPackages($devDependencies, 'prettier');
        }

        if ($this->option('cypress')) {
            $devDependencies = $this->addPackages($devDependencies, 'cypress');
        }

        ksort($devDependencies);

        return $devDependencies;
    }

    /**
     * Add the required node packages for the given element.
     *
     * @param  array<string, string>  $devDependencies
     * @return array<string, string>
     */
    protected function addPackages(array $devDependencies, string $element): array
    {
        $packages = (array) config('laravel-svelte.dependencies.'.$element, []);

        foreach ($packages as $packageName => $packageVersion) {
            // We are only interested in the immediate children. Ignore nested arrays.
            if (is_string($packageVersion)) {
                $devDependencies[$packageName] = $packageVersion;
            }
        }

        return $devDependencies;
    }

    /**
     * Remove the Vue packages.
     *
     * @param  array<string, string>  $devDependencies
     * @return array<string, string>
     */
    protected function removeVueNodePackages(array $devDependencies): array
    {
        $vuePackages = (array) config('laravel-svelte.dependencies.vue', []);

        foreach ($vuePackages as $vuePackage) {
            if (isset($devDependencies[$vuePackage])) {
                unset($devDependencies[$vuePackage]);
            }
        }

        return $devDependencies;
    }

    /**
     * Add Node helpers. For example, npm run format, npm run check and npm run test.
     *
     * @param  array<string, string>  $scripts
     * @return array<string, string>
     */
    protected function addNodeScripts(array $scripts): array
    {
        $formatParts = ['./vendor/bin/pint'];
        $checkParts = ['./vendor/bin/pint --test'];
        $testParts = ['php artisan test'];

        if ($this->option('eslint')) {
            $formatParts[] = 'eslint --fix .';
            $checkParts[] = 'eslint .';
        }

        if ($this->option('prettier')) {
            $formatParts[] = 'prettier --write .';
            $checkParts[] = 'prettier --check .';
        }

        $checkParts[] = 'svelte-check --tsconfig ./tsconfig.json';

        if ($this->option('cypress')) {
            $testParts[] = 'php artisan serve --env=testing & cypress run';
        }

        $scripts['format'] = implode(' && ', $formatParts);
        $scripts['check'] = implode(' && ', $checkParts);
        $scripts['test'] = implode(' && ', $testParts);

        if ($this->option('cypress')) {
            $scripts['test-gui'] = 'php artisan serve --env=testing & cypress open';
        }

        $scripts['all-no-tests'] = 'npm run format && npm run check && npm run build';
        $scripts['all'] = $scripts['all-no-tests'].' && npm run test';

        return $scripts;
    }

    /**
     * Write the package.json file.
     *
     * @param  array{'scripts': array<string, string>, 'devDependencies': array<string, string>}  $packageJson
     */
    protected function writePackageJson(string $packagePath, array $packageJson): void
    {
        file_put_contents(
            $packagePath,
            json_encode($packageJson, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT).PHP_EOL
        );
    }
}
