<script lang="ts">
	import { page } from '$app/state';
	import type { Snippet } from 'svelte';

	let { data, children }: { data: any; children: Snippet } = $props();
	let isMobileMenuOpen = $state(false);

	const pathname = $derived(page.url.pathname);
	const user = $derived(data.user);

	// Navigation items with role permissions
	const navItems = $derived([
		{ label: 'Dashboard', href: '/admin', roles: ['viewer', 'author', 'editor', 'owner'], icon: 'layout' },
		{ label: 'Posts', href: '/admin/posts', roles: ['viewer', 'author', 'editor', 'owner'], icon: 'file-text' },
		{ label: 'Media Library', href: '/admin/media', roles: ['viewer', 'author', 'editor', 'owner'], icon: 'image' },
		{ label: 'Subscribers', href: '/admin/subscribers', roles: ['editor', 'owner'], icon: 'users' },
		{ label: 'Redirects', href: '/admin/redirects', roles: ['editor', 'owner'], icon: 'corner-down-right' },
		{ label: 'Audit Log', href: '/admin/audit', roles: ['owner'], icon: 'shield-alert' },
		{ label: 'Users', href: '/admin/users', roles: ['owner'], icon: 'user-check' },
		{ label: 'Settings', href: '/admin/settings', roles: ['owner'], icon: 'settings' }
	]);

	function isCurrent(href: string) {
		if (href === '/admin') {
			return pathname === '/admin';
		}
		return pathname.startsWith(href);
	}

	function canAccess(itemRoles: string[]) {
		if (!user) return false;
		return itemRoles.includes(user.role);
	}
</script>

{#if !user}
	{@render children()}
{:else}
	<div class="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-800 text-sm">
		<!-- Mobile Header -->
		<header class="md:hidden bg-slate-900 text-white flex items-center justify-between px-4 py-3 border-b border-slate-800 sticky top-0 z-30">
			<div class="flex items-center space-x-2">
				<span class="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-xs text-white">
					AI
				</span>
				<span class="font-semibold text-sm tracking-tight">AI Tathastu Admin</span>
			</div>
			<button
				type="button"
				onclick={() => isMobileMenuOpen = !isMobileMenuOpen}
				class="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
				aria-label="Toggle navigation menu"
			>
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					{#if isMobileMenuOpen}
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					{:else}
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
					{/if}
				</svg>
			</button>
		</header>

		<!-- Sidebar Navigation -->
		<aside
			class={`fixed inset-y-0 left-0 z-20 w-64 bg-slate-900 text-slate-300 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static flex flex-col shrink-0 ${
				isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
			}`}
		>
			<div class="p-5 border-b border-slate-800 flex items-center space-x-3">
				<div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-sm">
					AI
				</div>
				<div>
					<h2 class="font-semibold text-white text-sm tracking-tight leading-none">AI Tathastu</h2>
					<p class="text-xs text-slate-400 mt-1">Editorial Desk</p>
				</div>
			</div>

			<!-- Navigation Links -->
			<nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
				{#each navItems as item}
					{#if canAccess(item.roles)}
						<a
							href={item.href}
							onclick={() => isMobileMenuOpen = false}
							class={`flex items-center px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
								isCurrent(item.href)
									? 'bg-indigo-600 text-white font-semibold'
									: 'text-slate-300 hover:bg-slate-800 hover:text-white'
							}`}
						>
							<span class="truncate">{item.label}</span>
						</a>
					{/if}
				{/each}
			</nav>

			<!-- Quick Links & User Footer -->
			<div class="p-3 border-t border-slate-800 space-y-3">
				<a
					href="/"
					target="_blank"
					class="flex items-center justify-between px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
				>
					<span>View Live Site</span>
					<span class="text-xs">↗</span>
				</a>

				<div class="bg-slate-800/80 rounded-xl p-3 flex items-center justify-between">
					<div class="min-w-0 pr-2">
						<p class="text-xs font-semibold text-white truncate">{user.name}</p>
						<p class="text-[11px] text-slate-400 truncate">{user.email}</p>
						<div class="mt-1">
							<span class="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-indigo-900/80 text-indigo-200 border border-indigo-700/50">
								{user.role}
							</span>
						</div>
					</div>
					<form action="/admin/logout" method="POST">
						<button
							type="submit"
							title="Sign out"
							class="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded-lg transition"
						>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
							</svg>
						</button>
					</form>
				</div>
			</div>
		</aside>

		<!-- Main Admin Content Area -->
		<main class="flex-1 min-w-0 overflow-y-auto">
			{@render children()}
		</main>
	</div>
{/if}
