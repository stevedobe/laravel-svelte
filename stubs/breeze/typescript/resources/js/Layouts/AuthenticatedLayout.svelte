<script lang="ts">
    import { inertia, page, router } from '@inertiajs/svelte';
    import ApplicationLogo from '@/Components/ApplicationLogo.svelte';
    import Dropdown from '@/Components/Dropdown.svelte';
    import DropdownLink from '@/Components/DropdownLink.svelte';
    import NavLink from '@/Components/NavLink.svelte';
    import ResponsiveNavLink from '@/Components/ResponsiveNavLink.svelte';

    let { user } = $page.props.auth;
    $: user = $page.props.auth.user;

    let showingNavigationDropdown = false;

    const logout = () => {
        router.post('/logout');
    };
</script>

<div>
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
        <nav class="border-b border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800">
            <!-- Primary Navigation Menu -->
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="flex h-16 justify-between">
                    <div class="flex">
                        <!-- Logo -->
                        <div class="flex shrink-0 items-center">
                            <a href="/dashboard" use:inertia>
                                <ApplicationLogo
                                    classes="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200"
                                />
                            </a>
                        </div>

                        <!-- Navigation Links -->
                        <div class="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                            <NavLink
                                href="/dashboard"
                                active={$page.props.webtend.currentRouteName === 'dashboard'}
                            >
                                Dashboard
                            </NavLink>
                        </div>
                    </div>

                    {#if user}
                        <div class="hidden sm:ms-6 sm:flex sm:items-center">
                            <!-- Settings Dropdown -->
                            <div class="relative ms-3" data-testid="user-menu">
                                <Dropdown>
                                    <div slot="trigger" class="contents">
                                        <span class="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                class="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                                            >
                                                {user.name}

                                                <svg
                                                    class="-me-0.5 ms-2 size-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fill-rule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clip-rule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </div>

                                    <div slot="content" class="contents">
                                        <DropdownLink href="/profile">Profile</DropdownLink>

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
                            on:click={() => {
                                showingNavigationDropdown = !showingNavigationDropdown;
                            }}
                            class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none dark:text-gray-500 dark:hover:bg-gray-900 dark:hover:text-gray-400 dark:focus:bg-gray-900 dark:focus:text-gray-400"
                            aria-label="Menu"
                            data-testid="user-menu"
                        >
                            <svg
                                class="size-6"
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
                        active={$page.props.webtend.currentRouteName === 'dashboard'}
                    >
                        Dashboard
                    </ResponsiveNavLink>
                </div>

                <!-- Responsive Settings Options -->
                {#if user}
                    <div class="border-t border-gray-200 pb-1 pt-4 dark:border-gray-600">
                        <div class="px-4">
                            <div class="text-base font-medium text-gray-800 dark:text-gray-200">
                                {user.name}
                            </div>
                            <div class="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div class="mt-3 space-y-1">
                            <ResponsiveNavLink href="/profile">Profile</ResponsiveNavLink>

                            <form on:submit|preventDefault={logout}>
                                <ResponsiveNavLink as="button">Log Out</ResponsiveNavLink>
                            </form>
                        </div>
                    </div>
                {/if}
            </div>
        </nav>

        <!-- Page Heading -->
        {#if $$slots.header}
            <header class="bg-white shadow-sm dark:bg-gray-800">
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
