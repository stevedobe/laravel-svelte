<?php

namespace SteveDobe\LaravelSvelte\Concerns;

use Exception;

trait RemovesZiggy
{
    /**
     * Removes Ziggy.
     *
     * We also need to remove references to Ziggy in app.js, ssr.js and
     * HandleInertiaRequests. However, we do this in UpdatesFiles.
     */
    protected function removeZiggy(): bool
    {
        try {
            $this->components->info('Removing Ziggy...');

            $this->removeComposerPackage('tightenco/ziggy');

            $this->output->writeln('');
            $this->components->info('Ziggy removed.');

            return true;
        } catch (Exception $e) {
            $this->components->error($e->getMessage());

            return false;
        }
    }
}
