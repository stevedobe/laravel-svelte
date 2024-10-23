<?php

namespace SteveDobe\LaravelSvelte\Concerns;

trait ValidatesLaravel
{
    /**
     * Checks to ensure required files exist. If they do not, they are created.
     */
    protected function requiredFilesExist(): bool
    {
        // If composer.json does not exist, there is no point in continuing.
        if (! file_exists(base_path('composer.json'))) {
            $this->components->error('Could not find composer.json file. Please install composer.');

            return false;
        }

        // If package.json does not exist, there is no point in continuing.
        if (! file_exists(base_path('package.json'))) {
            $this->components->error('Could not find package.json file. Please install npm or yarn.');

            return false;
        }

        if ($this->hasComposerPackage('laravel/breeze')) {
            if ($this->composerPackageVersion('laravel/breeze') !== '^2.2') {
                $this->components->error('This package is only compatible with Laravel Breeze 2.2.');

                return false;
            }
        }

        if ($this->hasComposerPackage('laravel/jetstream')) {
            if ($this->composerPackageVersion('laravel/jetstream') !== '^5.3') {
                $this->components->error('This package is only compatible with Laravel Jetstream 5.3.');

                return false;
            }
        }

        // These files should exist for a base Laravel install. Arguably, we should
        // not proceed. However, we are choosing to create them and move on.
        $requiredFiles = [
            base_path('.env'),
            base_path('.gitignore'),
            base_path('jsconfig.json'),
            base_path('tailwind.config.js'),
            base_path('vite.config.js'),
            resource_path('views/app.blade.php'),
            resource_path('js/app.js'),
            resource_path('js/bootstrap.js'),
            base_path('routes/web.php'),
        ];

        foreach ($requiredFiles as $file) {
            if (! file_exists($file)) {
                $this->filesystem->ensureDirectoryExists(dirname($file));
                touch($file);
            }
        }

        return true;
    }
}
