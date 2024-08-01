<?php

namespace SteveDobe\LaravelSvelte\Concerns;

use Exception;

trait ManagesPhpDependencies
{
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

    /**
     * Removes the given Composer Package from the application.
     */
    protected function removeComposerPackage(string $package, bool $asDev = false): void
    {
        if (! $this->hasComposerPackage($package)) {
            return;
        }

        $composer = $this->option('composer');

        if (! is_string($composer)) {
            throw new Exception('The composer option provided must be a string.');
        }

        $command = $composer !== 'global'
            ? 'php '.$composer.' remove '
            : 'composer remove ';

        $command .= $package.($asDev ? ' --dev' : '');

        $this->runCommands([$command]);
    }
}
