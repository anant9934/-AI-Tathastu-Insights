<script lang="ts">
	import './layout.css';
	import { page } from '$app/state';
	import type { Snippet } from 'svelte';

	let { data, children }: { data: any; children: Snippet } = $props();

	const pathname = $derived(page.url.pathname);
	const isAdmin = $derived(pathname.startsWith('/admin') || pathname.startsWith('/preview'));

	// Mobile Navigation Menu State
	let mobileMenuOpen = $state(false);

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}
</script>

<svelte:head>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="theme-color" content="#F8F7F4" />
</svelte:head>

<!-- Skip to content link (WCAG AA & UI-06) -->
<a
	href="#main-content"
	class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#0F172A] focus:text-white focus:rounded-lg focus:shadow-lg focus:font-semibold focus:text-xs"
>
	Skip to main content
</a>

{#if isAdmin}
	<!-- Admin uses its own dedicated chrome layout -->
	{@render children()}
{:else}
	<!-- Public Editorial Site Chrome -->
	<div class="min-h-screen flex flex-col bg-[#F8F7F4] text-[#0F172A] font-sans antialiased selection:bg-[#0F766E] selection:text-white">
		<!-- Global Navigation Header with Neomorphism (64px / h-16) -->
		<header class="neomorph-navbar sticky top-0 z-40">
			<div class="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
				<!-- Brand Logo & Neomorphic Tile -->
				<div class="flex items-center gap-8">
					<a href="/" class="flex items-center gap-2.5 group">
						<span class="neomorph-brand-tile w-8 h-8 rounded-xl font-serif font-bold text-base flex items-center justify-center transition-transform group-hover:scale-105">
							T
						</span>
						<span class="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#0F172A] group-hover:text-[#0F766E] transition-colors">
							{data.siteConfig.site_name || 'AI Tathastu Insights'}
						</span>
					</a>

					<!-- Desktop Nav Hub Links with Soft Neomorphic Inset/Extruded Pills -->
					<nav class="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-[#F3F1EC]/60 border border-white/60 shadow-[inset_1px_1px_2px_rgba(15,23,42,0.04)]">
						<a
							href="/news"
							class={pathname.startsWith('/news') ? 'neomorph-nav-link neomorph-nav-link-active' : 'neomorph-nav-link'}
						>
							News
						</a>
						<a
							href="/newsletter"
							class={pathname.startsWith('/newsletter') ? 'neomorph-nav-link neomorph-nav-link-active' : 'neomorph-nav-link'}
						>
							Newsletter
						</a>
						<a
							href="/ecosystem"
							class={pathname.startsWith('/ecosystem') ? 'neomorph-nav-link neomorph-nav-link-active' : 'neomorph-nav-link'}
						>
							Ecosystem
						</a>
						<a
							href="/changelog"
							class={pathname.startsWith('/changelog') ? 'neomorph-nav-link neomorph-nav-link-active' : 'neomorph-nav-link'}
						>
							Changelog
						</a>
					</nav>
				</div>

				<!-- Right Actions: Neomorphic Search Button + Neomorphic Accent Subscribe Button -->
				<div class="flex items-center gap-2.5 sm:gap-3">
					<a
						href="/search"
						aria-label="Search articles and publications"
						class="neomorph-btn-icon"
						title="Search publications"
						data-sveltekit-preload-data="hover"
					>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
					</a>

					<a
						href="/subscribe"
						class="neomorph-btn-accent"
						data-sveltekit-preload-data="hover"
					>
						Subscribe
					</a>

					{#if data.user}
						<a
							href="/admin"
							class="hidden sm:inline-flex text-xs font-semibold px-3 py-2 rounded-lg bg-[#CCFBF1] text-[#0F766E] hover:bg-[#99F6E4] border border-[#0F766E]/20 transition shadow-xs"
							data-sveltekit-preload-data="hover"
						>
							Admin Desk →
						</a>
					{/if}

					<!-- Mobile Hamburger Trigger with Accessible Tap Target -->
					<button
						type="button"
						aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
						aria-expanded={mobileMenuOpen}
						aria-controls="mobile-navigation-menu"
						onclick={toggleMobileMenu}
						class="neomorph-btn-icon md:hidden"
					>
						{#if mobileMenuOpen}
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
							</svg>
						{:else}
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
							</svg>
						{/if}
					</button>
				</div>
			</div>

			<!-- Mobile Collapsible Menu Drawer -->
			{#if mobileMenuOpen}
				<div class="md:hidden border-t border-[#E2E8F0] bg-[#F8F7F4]/98 backdrop-blur-xl px-4 py-4 space-y-2 shadow-lg">
					<a
						href="/news"
						onclick={closeMobileMenu}
						class={`block px-4 py-2.5 rounded-xl text-sm font-medium transition ${
							pathname.startsWith('/news')
								? 'bg-[#F1EFEA] text-[#0F766E] font-semibold shadow-[inset_2px_2px_4px_rgba(15,23,42,0.06)]'
								: 'text-[#475569] hover:bg-slate-100'
						}`}
					>
						News
					</a>
					<a
						href="/newsletter"
						onclick={closeMobileMenu}
						class={`block px-4 py-2.5 rounded-xl text-sm font-medium transition ${
							pathname.startsWith('/newsletter')
								? 'bg-[#F1EFEA] text-[#0F766E] font-semibold shadow-[inset_2px_2px_4px_rgba(15,23,42,0.06)]'
								: 'text-[#475569] hover:bg-slate-100'
						}`}
					>
						Newsletter
					</a>
					<a
						href="/ecosystem"
						onclick={closeMobileMenu}
						class={`block px-4 py-2.5 rounded-xl text-sm font-medium transition ${
							pathname.startsWith('/ecosystem')
								? 'bg-[#F1EFEA] text-[#0F766E] font-semibold shadow-[inset_2px_2px_4px_rgba(15,23,42,0.06)]'
								: 'text-[#475569] hover:bg-slate-100'
						}`}
					>
						Ecosystem
					</a>
					<a
						href="/changelog"
						onclick={closeMobileMenu}
						class={`block px-4 py-2.5 rounded-xl text-sm font-medium transition ${
							pathname.startsWith('/changelog')
								? 'bg-[#F1EFEA] text-[#0F766E] font-semibold shadow-[inset_2px_2px_4px_rgba(15,23,42,0.06)]'
								: 'text-[#475569] hover:bg-slate-100'
						}`}
					>
						Changelog
					</a>
					<div class="pt-2 border-t border-[#E2E8F0] flex gap-2">
						<a
							href="/subscribe"
							onclick={closeMobileMenu}
							class="flex-1 text-center py-2.5 rounded-xl bg-[#0F766E] text-white text-sm font-semibold shadow-xs"
						>
							Subscribe Now
						</a>
						{#if data.user}
							<a
								href="/admin"
								onclick={closeMobileMenu}
								class="px-4 py-2.5 rounded-xl bg-[#CCFBF1] text-[#0F766E] text-sm font-semibold border border-[#0F766E]/20"
							>
								Admin
							</a>
						{/if}
					</div>
				</div>
			{/if}
		</header>

		<!-- Main Content Slot -->
		<main id="main-content" class="flex-1">
			{@render children()}
		</main>

		<!-- Global Editorial Footer with Elevated Neomorphic Foundation Panel -->
		<footer class="neomorph-footer-panel text-[#475569] pt-20 pb-12 mt-20">
			<div class="max-w-7xl mx-auto px-4 md:px-8">
				<!-- 4-Column Grid -->
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
					<!-- Column 1: Brand & Mission -->
					<div class="space-y-4">
						<a href="/" class="flex items-center gap-2.5 group">
							<span class="neomorph-brand-tile w-7 h-7 rounded-lg font-serif font-bold text-sm flex items-center justify-center shadow-xs">
								T
							</span>
							<span class="font-serif text-xl font-bold text-[#0F172A] tracking-tight group-hover:text-[#0F766E] transition-colors">
								AI Tathastu Insights
							</span>
						</a>
						<p class="text-sm text-[#475569] leading-relaxed max-w-xs">
							Company news, newsletters, changelog, and ecosystem updates from AI Tathastu.
						</p>
						<a
							href="https://aitathastu.info"
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center text-sm font-semibold text-[#0F766E] hover:underline gap-1 group"
						>
							Explore the AI Tathastu Platform
							<span class="inline-block transition-transform group-hover:translate-x-1">→</span>
						</a>

						<!-- Operational Status -->
						<div class="pt-2 flex items-center gap-2 text-xs text-slate-500 font-medium">
							<span class="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)] animate-pulse"></span>
							<span>Systems fully operational</span>
						</div>
					</div>

					<!-- Column 2: The Ecosystem - Products -->
					<nav aria-label="Ecosystem products" class="space-y-3">
						<h3 class="text-xs font-bold tracking-wider text-[#0F172A] uppercase mb-4 flex items-center gap-1.5">
							<span>ECOSYSTEM</span>
							<span class="text-[10px] font-semibold text-[#0F766E] bg-[#CCFBF1] px-2 py-0.5 rounded-full">Suite</span>
						</h3>
						<ul class="space-y-2.5 text-sm">
							<li>
								<a
									href="https://aitathastu.info"
									target="_blank"
									rel="noopener noreferrer"
									class="inline-flex items-center text-[#475569] hover:text-[#0F766E] transition-colors group"
								>
									<span class="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)] inline-block mr-2.5 shrink-0 group-hover:scale-125 transition-transform"></span>
									Platform Home
								</a>
							</li>
							<li>
								<a
									href="https://aitathastu.info/mentormaze"
									target="_blank"
									rel="noopener noreferrer"
									class="inline-flex items-center text-[#475569] hover:text-[#0F766E] transition-colors group"
								>
									<span class="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)] inline-block mr-2.5 shrink-0 group-hover:scale-125 transition-transform"></span>
									MentorMaze
								</a>
							</li>
							<li>
								<a
									href="https://aitathastu.info/connect"
									target="_blank"
									rel="noopener noreferrer"
									class="inline-flex items-center text-[#475569] hover:text-[#0F766E] transition-colors group"
								>
									<span class="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] inline-block mr-2.5 shrink-0 group-hover:scale-125 transition-transform"></span>
									Connect
								</a>
							</li>
							<li>
								<a
									href="https://aitathastu.info/avasar"
									target="_blank"
									rel="noopener noreferrer"
									class="inline-flex items-center text-[#475569] hover:text-[#0F766E] transition-colors group"
								>
									<span class="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)] inline-block mr-2.5 shrink-0 group-hover:scale-125 transition-transform"></span>
									Avsar
								</a>
							</li>
							<li>
								<a
									href="https://aitathastu.info/learn"
									target="_blank"
									rel="noopener noreferrer"
									class="inline-flex items-center text-[#475569] hover:text-[#0F766E] transition-colors group"
								>
									<span class="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)] inline-block mr-2.5 shrink-0 group-hover:scale-125 transition-transform"></span>
									Learn
								</a>
							</li>
							<li>
								<a
									href="https://aitathastu.info/iris"
									target="_blank"
									rel="noopener noreferrer"
									class="inline-flex items-center text-[#475569] hover:text-[#0F766E] transition-colors group"
								>
									<span class="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.6)] inline-block mr-2.5 shrink-0 group-hover:scale-125 transition-transform"></span>
									IRIS
								</a>
							</li>
						</ul>
					</nav>

					<!-- Column 3: Publications -->
					<nav aria-label="Publications" class="space-y-3">
						<h3 class="text-xs font-bold tracking-wider text-[#0F172A] uppercase mb-4">
							PUBLICATIONS
						</h3>
						<ul class="space-y-2.5 text-sm">
							<li>
								<a
									href="/news"
									class={`transition-colors block ${pathname.startsWith('/news') ? 'text-[#0F766E] font-semibold' : 'text-[#475569] hover:text-[#0F766E]'}`}
								>
									Company News
								</a>
							</li>
							<li>
								<a
									href="/newsletter"
									class={`transition-colors block ${pathname.startsWith('/newsletter') ? 'text-[#0F766E] font-semibold' : 'text-[#475569] hover:text-[#0F766E]'}`}
								>
									Editorial Newsletter
								</a>
							</li>
							<li>
								<a
									href="/ecosystem"
									class={`transition-colors block ${pathname.startsWith('/ecosystem') ? 'text-[#0F766E] font-semibold' : 'text-[#475569] hover:text-[#0F766E]'}`}
								>
									Ecosystem & Partners
								</a>
							</li>
							<li>
								<a
									href="/changelog"
									class={`transition-colors block ${pathname.startsWith('/changelog') ? 'text-[#0F766E] font-semibold' : 'text-[#475569] hover:text-[#0F766E]'}`}
								>
									Product Changelog
								</a>
							</li>
						</ul>
					</nav>

					<!-- Column 4: Resources & Legal -->
					<nav aria-label="Resources and legal" class="space-y-3">
						<h3 class="text-xs font-bold tracking-wider text-[#0F172A] uppercase mb-4">
							RESOURCES
						</h3>
						<ul class="space-y-2.5 text-sm">
							<li>
								<a href="https://aitathastu.info" target="_blank" rel="noopener noreferrer" class="text-[#475569] hover:text-[#0F766E] transition-colors block">
									About AI Tathastu
								</a>
							</li>
							<li>
								<a href="/news" class="text-[#475569] hover:text-[#0F766E] transition-colors block">
									Press Kit
								</a>
							</li>
							<li>
								<a href="/privacy" class="text-[#475569] hover:text-[#0F766E] transition-colors block">
									Privacy Policy (GDPR)
								</a>
							</li>
							<li>
								<a href="/privacy" class="text-[#475569] hover:text-[#0F766E] transition-colors block">
									Terms of Service
								</a>
							</li>
							<li>
								<a href="/rss.xml" class="text-[#475569] hover:text-[#0F766E] transition-colors block">
									RSS 2.0 Feed
								</a>
							</li>
							<li>
								<a href="/admin/login" class="text-[#475569] hover:text-[#0F766E] transition-colors block">
									Staff Sign In
								</a>
							</li>
						</ul>
					</nav>
				</div>

				<!-- Bottom Bar with Inset Highlight Divider -->
				<div class="border-t border-[#E5E2DA] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs">
					<p class="text-[#475569]">
						© 2026 AI Tathastu Insights. All rights reserved.
					</p>
					<div class="flex items-center gap-4 text-slate-400">
						<span>Engineered with SvelteKit, Drizzle ORM, Neon & Cloudinary</span>
						<span>•</span>
						<a href="/sitemap.xml" class="hover:text-slate-600 transition">Sitemap</a>
					</div>
				</div>
			</div>
		</footer>
	</div>
{/if}
