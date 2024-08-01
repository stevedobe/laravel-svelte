<?php

namespace SteveDobe\LaravelSvelte;

use Illuminate\Support\ServiceProvider;

class LaravelSvelteServiceProvider extends ServiceProvider
{
    /**
     * Perform post-registration booting of services.
     */
    public function boot(): void
    {
        if (! $this->app->runningInConsole()) {
            return;
        }

        $this->publishes([
            __DIR__.'/../config/laravel-svelte.php' => config_path('laravel-svelte.php'),
        ], 'laravel-svelte.config');

        $this->commands([
            Console\SwapVueWithSvelteCommand::class,
        ]);
    }

    /**
     * Register any package services.
     */
    public function register(): void
    {
        $this->mergeConfigFrom(__DIR__.'/../config/laravel-svelte.php', 'laravel-svelte');
    }
}
