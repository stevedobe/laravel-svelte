<?php

namespace SteveDobe\LaravelSvelte\Concerns;

use Exception;

trait ManagesPhpDependencies
{
    /**
     * Determine if the given Composer package is installed.
     */
    protected function updateComposerJson(): bool
    {
        try {
            $this->components->info('Removing Ziggy...');
            $this->composerPackage('tightenco/ziggy', 'remove');
            $this->components->info('Ziggy removed.');

            $this->components->info('Updating Inertia...');
            $this->composerPackage('inertiajs/inertia-laravel:^2.0', 'require');
            $this->components->info('Inertia updated.');

            return true;
        } catch (Exception $e) {
            $this->components->error($e->getMessage());

            return false;
        }
    }

    /**
     * Requires or removes the given Composer Package from the application.
     */
    protected function composerPackage(string $package, string $requireOrRemove, bool $asDev = false): void
    {
        if (! $this->hasComposerPackage($package)) {
            return;
        }

        $composer = $this->option('composer');

        if (! is_string($composer)) {
            throw new Exception('The composer option provided must be a string.');
        }

        $command = $composer !== 'global'
            ? 'php '.$composer.' '.$requireOrRemove.' '
            : 'composer '.$requireOrRemove.' ';

        $command .= $package.($asDev ? ' --dev' : '');

        $this->runCommands([$command]);
    }

    /**
     * Determine if the given Composer package is installed.
     */
    protected function hasComposerPackage(string $package): bool
    {
        $json = $this->fileAsJson(base_path('composer.json'));

        return array_key_exists($package, $json['require'] ?? [])
            || array_key_exists($package, $json['require-dev'] ?? []);
    }

    /**
     * Determine the version of the Composer package installed.
     */
    protected function composerPackageVersion(string $package): string
    {
        $json = $this->fileAsJson(base_path('composer.json'));

        if (array_key_exists('require', $json) && array_key_exists($package, $json['require'])) {
            return $json['require'][$package];
        }

        if (array_key_exists('require-dev', $json) && array_key_exists($package, $json['require-dev'])) {
            return $json['require-dev'][$package];
        }

        return '';
    }
}
