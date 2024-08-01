<?php

namespace SteveDobe\LaravelSvelte\Concerns;

use Exception;

trait RemovesZiggy
{
    /**
     * Removes Ziggy.
     *
     * We also need to remove references to Ziggy in app.js and ssr.js. However, these
     * files are replaced in UpdatesFiles, so it is not necessary here.
     */
    protected function removeZiggy(): bool
    {
        try {
            $this->components->info('Removing Ziggy...');

            $this->removeComposerPackage('tightenco/ziggy');
            $this->updateInertiaMiddleware();

            $this->output->writeln('');
            $this->components->info('Ziggy removed.');

            return true;
        } catch (Exception $e) {
            $this->components->error($e->getMessage());

            return false;
        }
    }

    /**
     * Remove Ziggy from HandleInertiaRequests and add currentRouteName.
     *
     * Unrelated, but while we are here, add appName for the Helmet component.
     */
    protected function updateInertiaMiddleware(): void
    {
        $middlewarePath = base_path('app/Http/Middleware/HandleInertiaRequests.php');

        $this->replaceInFile(
            searchFor: 'use Illuminate\Http\Request;',
            replaceWith: 'use Illuminate\Http\Request;'.PHP_EOL.'use Illuminate\Support\Facades\Route;',
            filePath: $middlewarePath
        );

        $this->removeLinesContainingString($middlewarePath, 'use Tighten\Ziggy\Ziggy');

        $this->replaceInFile(
            searchFor: "/'ziggy' => fn \(\) => \[[\s\S]+?\]/",
            replaceWith: "'appName' => config('app.name'),".PHP_EOL."            'currentRouteName' => Route::currentRouteName()",
            filePath: $middlewarePath,
            regex: true
        );
    }
}
