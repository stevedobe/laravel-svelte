<script lang="ts">
    import { inertia, page, router } from '@inertiajs/svelte';
    import ApplicationMark from '@/Components/ApplicationMark.svelte';
    import Banner from '@/Components/Banner.svelte';
    import Dropdown from '@/Components/Dropdown.svelte';
    import DropdownLink from '@/Components/DropdownLink.svelte';
    import Helmet from '@/Components/Helmet.svelte';
    import NavLink from '@/Components/NavLink.svelte';
    import ResponsiveNavLink from '@/Components/ResponsiveNavLink.svelte';
    import type { Team } from '@/Types';

    export let title = '';
    export let description = '';

    let showingNavigationDropdown = false;

    const switchToTeam = (event: { detail: { team: Team } }) => {
        router.put(
            '/current-team',
            {
                team_id: event.detail.team.id,
            },
            {
                preserveState: false,
            },
        );
    };

    const logout = () => {
        router.post('/logout');
    };
</script>

<Helmet {title} {description} />

<div>
    <Banner />

    <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
        <nav class="border-b border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800">
            <!-- Primary Navigation Menu -->
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="flex h-16 justify-between">
                    <div class="flex">
                        <!-- Logo -->
                        <div class="flex shrink-0 items-center">
                            <a href="/dashboard" use:inertia>
                                <ApplicationMark classes="block h-9 w-auto" />
                            </a>
                        </div>

                        <!-- Navigation Links -->
                        <div class="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                            <NavLink
                                href="/dashboard"
                                active={$page.props.currentRouteName === 'dashboard'}
                            >
                                Dashboard
                            </NavLink>
                        </div>
                    </div>

                    {#if $page.props.auth.user}
                        <div class="hidden sm:ms-6 sm:flex sm:items-center">
                            <div class="relative ms-3">
                                <!-- Teams Dropdown -->
                                {#if $page.props.jetstream.hasTeamFeatures && $page.props.auth.user.current_team}
                                    <Dropdown width={60}>
                                        <div slot="trigger" class="contents">
                                            <span class="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    class="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:bg-gray-50 focus:outline-none active:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300 dark:focus:bg-gray-700 dark:active:bg-gray-700"
                                                >
                                                    {$page.props.auth.user.current_team.name}

                                                    <svg
                                                        class="-me-0.5 ms-2 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke-width="1.5"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                            d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                                                        />
                                                    </svg>
                                                </button>
                                            </span>
                                        </div>

                                        <div slot="content" class="contents">
                                            <div class="w-60">
                                                <!-- Team Management -->
                                                <div class="block px-4 py-2 text-xs text-gray-400">
                                                    Manage Team
                                                </div>

                                                <!-- Team Settings -->
                                                <DropdownLink
                                                    href="/teams/{$page.props.auth.user.current_team
                                                        .id}"
                                                >
                                                    Team Settings
                                                </DropdownLink>

                                                {#if $page.props.jetstream.canCreateTeams}
                                                    <DropdownLink href="/teams/create">
                                                        Create New Team
                                                    </DropdownLink>
                                                {/if}

                                                <!-- Team Switcher -->
                                                {#if $page.props.auth.user.all_teams.length > 1}
                                                    <div
                                                        class="border-t border-gray-200 dark:border-gray-600"
                                                    />

                                                    <div
                                                        class="block px-4 py-2 text-xs text-gray-400"
                                                    >
                                                        Switch Teams
                                                    </div>

                                                    {#each $page.props.auth.user.all_teams as team (team.id)}
                                                        <form
                                                            on:submit|preventDefault={() => {
                                                                switchToTeam(team);
                                                            }}
                                                        >
                                                            <DropdownLink as="button">
                                                                <div class="flex items-center">
                                                                    {#if team.id === $page.props.auth.user.current_team_id}
                                                                        <svg
                                                                            class="me-2 h-5 w-5 text-green-400"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                            stroke-width="1.5"
                                                                            stroke="currentColor"
                                                                        >
                                                                            <path
                                                                                stroke-linecap="round"
                                                                                stroke-linejoin="round"
                                                                                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                            />
                                                                        </svg>
                                                                    {/if}

                                                                    <div>{team.name}</div>
                                                                </div>
                                                            </DropdownLink>
                                                        </form>
                                                    {/each}
                                                {/if}
                                            </div>
                                        </div>
                                    </Dropdown>
                                {/if}
                            </div>

                            <!-- Settings Dropdown -->
                            <div class="relative ms-3" data-cy="user-menu">
                                <Dropdown width={48}>
                                    <div slot="trigger" class="contents">
                                        {#if $page.props.jetstream.managesProfilePhotos}
                                            <button
                                                class="flex rounded-full border-2 border-transparent text-sm transition focus:border-gray-300 focus:outline-none"
                                            >
                                                <img
                                                    src={$page.props.auth.user.profile_photo_url}
                                                    alt={$page.props.auth.user.name}
                                                    class="h-8 w-8 rounded-full object-cover"
                                                />
                                            </button>
                                        {:else}
                                            <span class="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    class="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:bg-gray-50 focus:outline-none active:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300 dark:focus:bg-gray-700 dark:active:bg-gray-700"
                                                >
                                                    {$page.props.auth.user.name}

                                                    <svg
                                                        class="-me-0.5 ms-2 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke-width="1.5"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                                                        />
                                                    </svg>
                                                </button>
                                            </span>
                                        {/if}
                                    </div>

                                    <div slot="content" class="contents">
                                        <!-- Account Management -->
                                        <div class="block px-4 py-2 text-xs text-gray-400">
                                            Manage Account
                                        </div>

                                        <DropdownLink href="/user/profile">Profile</DropdownLink>

                                        {#if $page.props.jetstream.hasApiFeatures}
                                            <DropdownLink href="/user/api-tokens">
                                                API Tokens
                                            </DropdownLink>
                                        {/if}

                                        <div
                                            class="border-t border-gray-200 dark:border-gray-600"
                                        />

                                        <!-- Authentication -->

                                        <form on:submit|preventDefault={logout}>
                                            <DropdownLink as="button">Log Out</DropdownLink>
                                        </form>
                                    </div>
                                </Dropdown>
                            </div>
                        </div>
                    {/if}

                    <!-- Hamburger -->
                    <div class="-me-2 flex items-center sm:hidden">
                        <button
                            class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none dark:text-gray-500 dark:hover:bg-gray-900 dark:hover:text-gray-400 dark:focus:bg-gray-900 dark:focus:text-gray-400"
                            on:click={() =>
                                (showingNavigationDropdown = !showingNavigationDropdown)}
                        >
                            <svg
                                class="h-6 w-6"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    class:hidden={showingNavigationDropdown}
                                    class:inline-flex={!showingNavigationDropdown}
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                                <path
                                    class:hidden={!showingNavigationDropdown}
                                    class:inline-flex={showingNavigationDropdown}
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Responsive Navigation Menu -->
            <div
                class="sm:hidden"
                class:block={showingNavigationDropdown}
                class:hidden={!showingNavigationDropdown}
            >
                <div class="space-y-1 pb-3 pt-2">
                    <ResponsiveNavLink
                        href="/dashboard"
                        active={$page.props.currentRouteName === 'dashboard'}
                    >
                        Dashboard
                    </ResponsiveNavLink>
                </div>

                <!-- Responsive Settings Options -->
                {#if $page.props.auth.user}
                    <div class="border-t border-gray-200 pb-1 pt-4 dark:border-gray-600">
                        <div class="flex items-center px-4">
                            {#if $page.props.jetstream.managesProfilePhotos}
                                <div class="me-3 shrink-0">
                                    <img
                                        src={$page.props.auth.user.profile_photo_url}
                                        alt={$page.props.auth.user.name}
                                        class="h-10 w-10 rounded-full object-cover"
                                    />
                                </div>
                            {/if}

                            <div>
                                <div class="text-base font-medium text-gray-800 dark:text-gray-200">
                                    {$page.props.auth.user.name}
                                </div>
                                <div class="text-sm font-medium text-gray-500">
                                    {$page.props.auth.user.email}
                                </div>
                            </div>
                        </div>

                        <div class="mt-3 space-y-1">
                            <ResponsiveNavLink
                                href="/user/profile"
                                active={$page.props.currentRouteName === 'profile.show'}
                            >
                                Profile
                            </ResponsiveNavLink>

                            {#if $page.props.jetstream.hasApiFeatures}
                                <ResponsiveNavLink
                                    href="/user/api-tokens"
                                    active={$page.props.currentRouteName === 'api-tokens.index'}
                                >
                                    API Tokens
                                </ResponsiveNavLink>
                            {/if}

                            <!-- Authentication -->
                            <form on:submit|preventDefault={logout}>
                                <ResponsiveNavLink as="button">Log Out</ResponsiveNavLink>
                            </form>

                            <!-- Team Management -->
                            {#if $page.props.jetstream.hasTeamFeatures && $page.props.auth.user.current_team}
                                <div class="border-t border-gray-200 dark:border-gray-600" />

                                <div class="block px-4 py-2 text-xs text-gray-400">Manage Team</div>

                                <!-- Team Settings -->
                                <ResponsiveNavLink
                                    href="/teams/{$page.props.auth.user.current_team.id}"
                                    active={$page.props.currentRouteName === 'teams.show'}
                                >
                                    Team Settings
                                </ResponsiveNavLink>

                                {#if $page.props.jetstream.canCreateTeams}
                                    <ResponsiveNavLink
                                        href="/teams/create"
                                        active={$page.props.currentRouteName === 'teams.create'}
                                    >
                                        Create New Team
                                    </ResponsiveNavLink>
                                {/if}

                                <!-- Team Switcher -->
                                {#if $page.props.auth.user.all_teams.length > 1}
                                    <div class="border-t border-gray-200 dark:border-gray-600" />

                                    <div class="block px-4 py-2 text-xs text-gray-400">
                                        Switch Teams
                                    </div>

                                    {#each $page.props.auth.user.all_teams as team (team.id)}
                                        <form
                                            on:submit|preventDefault={() => {
                                                switchToTeam(team);
                                            }}
                                        >
                                            <ResponsiveNavLink as="button">
                                                <div class="flex items-center">
                                                    {#if team.id === $page.props.auth.user.current_team_id}
                                                        <svg
                                                            class="me-2 h-5 w-5 text-green-400"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke-width="1.5"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                stroke-linecap="round"
                                                                stroke-linejoin="round"
                                                                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                            />
                                                        </svg>
                                                    {/if}
                                                    <div>{team.name}</div>
                                                </div>
                                            </ResponsiveNavLink>
                                        </form>
                                    {/each}
                                {/if}
                            {/if}
                        </div>
                    </div>
                {/if}
            </div>
        </nav>

        <!-- Page Heading -->
        {#if $$slots.header}
            <header class="bg-white shadow dark:bg-gray-800">
                <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <slot name="header" />
                </div>
            </header>
        {/if}

        <!-- Page Content -->
        <main>
            <slot />
        </main>
    </div>
</div>
