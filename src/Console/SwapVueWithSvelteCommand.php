<?php

namespace SteveDobe\LaravelSvelte\Console;

use Exception;
use Illuminate\Console\Command;
use Illuminate\Contracts\Console\PromptsForMissingInput;
use Illuminate\Filesystem\Filesystem;
use RuntimeException;
use SteveDobe\LaravelSvelte\Concerns\UpdatesFiles;
use SteveDobe\LaravelSvelte\Concerns\ManagesNodePackages;
use SteveDobe\LaravelSvelte\Concerns\ManagesPhpDependencies;
use SteveDobe\LaravelSvelte\Concerns\ValidatesLaravel;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Process\Process;

use function Laravel\Prompts\multiselect;
use function Laravel\Prompts\select;

class SwapVueWithSvelteCommand extends Command implements PromptsForMissingInput
{
    use ManagesNodePackages, ManagesPhpDependencies, UpdatesFiles, ValidatesLaravel;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'stevedobe:swap-vue-with-svelte
        {--eslint : ESLint - Find and fix problems in your JavaScript code}
        {--prettier : Prettier - Opinionated Code Formatter}
        {--cypress : Cypress - Front-end testing framework}
        {--playwright : Playwright - Front-end testing framework}
        {--composer=global : Absolute path to the Composer binary which should be used to install packages}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Replace Vue with Svelte in a fresh Laravel Breeze or Laravel Jetstream installation';

    /**
     * Create a new command instance.
     */
    public function __construct(protected Filesystem $filesystem)
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        if (! $this->requiredFilesExist()) {
            return 1;
        }

        if (! $this->updateComposerJson()) {
            return 1;
        }

        if (! $this->updatePackageJson()) {
            return 1;
        }

        if (! $this->updateFiles()) {
            return 1;
        }

        if (! $this->installNodePackagesAndBuildApplication()) {
            return 1;
        }

        $this->components->info('Vue has been replaced with Svelte.');

        return 0;
    }

    /**
     * Interact with the user before validating the input.
     */
    protected function interact(InputInterface $input, OutputInterface $output): void
    {
        parent::interact($input, $output);

        if (! $this->didReceiveOptions($input)) {
            $this->promptForOptions($input);
        }

        $this->afterPromptingForMissingArguments($input, $output);
    }

    /**
     * Prompt the user for optional features.
     */
    protected function promptForOptions(InputInterface $input): void
    {
        collect(multiselect(
            label: 'Would you like any optional features?',
            options: [
                'eslint' => 'ESLint     | Find and fix problems in your JavaScript code',
                'prettier' => 'Prettier   | Opinionated Code Formatter',
            ],
        ))->each(fn ($option) => $input->setOption((string) $option, true));
    }

    /**
     * Interact further with the user if they were prompted for missing arguments.
     *
     * @param  \Symfony\Component\Console\Input\InputInterface  $input
     * @param  \Symfony\Component\Console\Output\OutputInterface  $output
     * @return void
     */
    protected function afterPromptingForMissingArguments(InputInterface $input, OutputInterface $output): void
    {
        $default = match (true) {
            $this->option('cypress') => 'Cypress',
            $this->option('playwright') => 'Playwright',
            default => 'None',
        };

        $testing = select(
            label: 'Which front-end testing framework do you prefer?',
            options: ['None', 'Cypress', 'Playwright'],
            default: $default,
        );

        $input->setOption('cypress', $testing === 'Cypress');
        $input->setOption('playwright', $testing === 'Playwright');
    }

    /**
     * Install packages and build the application.
     */
    protected function installNodePackagesAndBuildApplication(): bool
    {
        $this->components->info('Installing Node dependencies and building application...');

        if (file_exists(base_path('pnpm-lock.yaml'))) {
            $this->runCommands(['pnpm install', 'pnpm run build']);

            return true;
        }

        if (file_exists(base_path('yarn.lock'))) {
            $this->runCommands(['yarn install', 'yarn run build']);

            return true;
        }

        if (file_exists(base_path('package-lock.json'))) {
            $this->runCommands(['npm install', 'npm run build']);

            return true;
        }

        $this->components->error('No package manager found. Please install npm or yarn.');

        return false;
    }

    /**
     * Run the given commands.
     *
     * @param  array<string>  $commands
     */
    protected function runCommands(array $commands): void
    {
        $process = Process::fromShellCommandline(implode(' && ', $commands), null, null, null, null);

        if ('\\' !== DIRECTORY_SEPARATOR && file_exists('/dev/tty') && is_readable('/dev/tty')) {
            try {
                $process->setTty(true);
            } catch (RuntimeException $e) {
                $this->components->warn($e->getMessage());
            }
        }

        $process->run(function ($type, $line) {
            if (is_string($line)) {
                $this->output->write('    '.$line);
            }
        });
    }

    /**
     * Get the contents of a file as a string.
     */
    protected function fileAsString(string $path): string
    {
        $contents = file_get_contents($path);

        if ($contents === false) {
            throw new Exception('Could not read '.$path.' file.');
        }

        return $contents;
    }

    /**
     * Get the contents of a file as a JSON array.
     *
     * @return array{
     *      'devDependencies'?: array<string, string>,
     *      'require'?: array<string, string>,
     *      'require-dev'?: array<string, string>,
     *      'scripts'?: array<string, string>,
     * }
     */
    protected function fileAsJson(string $path): array
    {
        $contents = $this->fileAsString($path);

        $json = json_decode($contents, true, 512, JSON_THROW_ON_ERROR);

        if (! is_array($json)) {
            throw new Exception('Invalid JSON in '.$path.' file.');
        }

        /**
         * @var array{
         *     'devDependencies'?: array<string, string>,
         *     'require'?: array<string, string>,
         *     'require-dev'?: array<string, string>,
         *     'scripts'?: array<string, string>,
         * } $json
         */
        return $json;
    }
}
