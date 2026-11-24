<script lang="ts">
	import type { PageData } from './$types';
	import { formatDate, getResponsiveImageProps } from '#lib/utils';

	let { data }: { data: PageData } = $props();

	// Helper for routing to corresponding hub
	function getHubPath(kind: string, slug: string) {
		const map: Record<string, string> = {
			article: 'news',
			announcement: 'news',
			newsletter: 'newsletter',
			changelog: 'changelog'
		};
		return `/${map[kind] || 'news'}/${slug}`;
	}

	function getChangelogBadge(type: string | null | undefined) {
		switch (type) {
			case 'new':
				return { label: 'NEW', class: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
			case 'improved':
				return { label: 'IMPROVED', class: 'bg-sky-50 text-sky-800 border-sky-200' };
			case 'fixed':
				return { label: 'FIXED', class: 'bg-amber-50 text-amber-800 border-amber-200' };
			case 'breaking':
				return { label: 'BREAKING', class: 'bg-rose-50 text-rose-800 border-rose-200' };
			default:
				return { label: 'RELEASE', class: 'bg-slate-100 text-slate-800 border-slate-200' };
		}
	}

	// 4 latest dispatch posts for the right-hand hero column (Memory bounded)
	const latestFour = $derived(data.recentFive.slice(0, 4));
</script>

<svelte:head>
	<title>AI Tathastu Insights — Company News, Newsletter & Ecosystem</title>
	<meta name="description" content="Official company news, architectural deep-dives, product releases, and newsletter issues from AI Tathastu." />
	<link rel="canonical" href="https://aitathastu.info/" />
	<meta property="og:title" content="AI Tathastu Insights" />
	<meta property="og:description" content="Company news, architectural deep-dives, and ecosystem insights." />
	<meta property="og:url" content="https://aitathastu.info/" />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="max-w-7xl mx-auto px-4 md:px-8 py-16 lg:py-24 space-y-20 lg:space-y-28">
	<!-- B. Hero Section: Featured (col-span-8) + Latest Dispatch (col-span-4) -->
	<section class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
		<!-- Left: Featured Post (Desktop col-span-8, 16:9 Image, Fluid H1, 2-line Excerpt, Meta) -->
		<div class="lg:col-span-8">
			{#if data.featuredPost}
				{@const href = getHubPath(data.featuredPost.kind, data.featuredPost.slug)}
				{@const heroImg = getResponsiveImageProps(data.featuredPost.coverMedia?.secureUrl, {
					alt: data.featuredPost.coverMedia?.altText || data.featuredPost.title,
					isHero: true,
					aspect: '16:9'
				})}
				<article class="group">
					<!-- 16:9 Cloudinary Cover Image with prevent-layout-shift aspect-video -->
					<div class="aspect-video w-full overflow-hidden rounded-xl bg-slate-100 border border-[#E2E8F0] shadow-xs relative">
						{#if heroImg}
							<!-- High-priority hero image with modern format negotiation (AVIF/WebP) and zero CLS -->
							<img
								src={heroImg.src}
								srcset={heroImg.srcset}
								sizes={heroImg.sizes}
								alt={heroImg.alt}
								width={heroImg.width}
								height={heroImg.height}
								loading={heroImg.loading}
								fetchpriority={heroImg.fetchpriority}
								decoding={heroImg.decoding}
								class="w-full h-full object-cover group-hover:scale-[1.02] transition duration-500 ease-out"
							/>
						{:else}
							<div class="w-full h-full bg-linear-to-tr from-slate-800 to-teal-900 flex items-center justify-center p-6 text-white/40">
								<span class="font-serif italic text-2xl">AI Tathastu Insights</span>
							</div>
						{/if}
					</div>

					<!-- Content below Image -->
					<div class="mt-6 space-y-3">
						<!-- Category Pill Badge above title -->
						<div class="flex items-center gap-2">
							<span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#CCFBF1] text-[#0F766E]">
								{data.featuredPost.category?.name || 'Company News'}
							</span>
							<span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
								FEATURED
							</span>
						</div>

						<!-- Large Serif Title with Fluid Typography -->
						<h1 class="font-serif text-[clamp(2.25rem,4.5vw,3.75rem)] lg:text-6xl font-bold text-[#0F172A] tracking-tight leading-[1.1] group-hover:text-[#0F766E] transition">
							<a {href} data-sveltekit-preload-data="hover">{data.featuredPost.title}</a>
						</h1>

						<!-- 2-Line Excerpt -->
						{#if data.featuredPost.excerpt}
							<p class="text-base lg:text-lg text-[#475569] leading-relaxed line-clamp-2 font-normal">
								{data.featuredPost.excerpt}
							</p>
						{/if}

						<!-- Bottom Row: Author, Date, Read Time -->
						<div class="pt-3 flex flex-wrap items-center gap-3 text-xs text-[#475569] font-medium">
							<span class="text-[#0F172A] font-bold">{data.featuredPost.author.name}</span>
							<span class="text-slate-300">•</span>
							<time datetime={new Date(data.featuredPost.publishedAt || '').toISOString()} class="uppercase tracking-wider text-[11px] text-slate-500 font-semibold">
								{formatDate(data.featuredPost.publishedAt)}
							</time>
							<span class="text-slate-300">•</span>
							<span class="text-slate-500 font-medium">{data.featuredPost.readingMinutes} min read</span>
						</div>
					</div>
				</article>
			{:else}
				<div class="p-16 bg-white rounded-xl border border-[#E2E8F0] text-center text-slate-400">
					No published stories yet.
				</div>
			{/if}
		</div>

		<!-- Right: Latest Dispatch (col-span-4 on desktop, border-l desktop, border-t mobile, 1:1 thumbnails) -->
		<div class="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-[#E2E8F0] pt-8 lg:pt-0 lg:pl-8 space-y-6">
			<div class="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
				<h2 class="text-xs font-bold text-[#475569] uppercase tracking-wider">
					LATEST DISPATCH
				</h2>
				<a href="/news" data-sveltekit-preload-data="hover" class="text-xs font-semibold text-[#0F766E] hover:underline">
					View all →
				</a>
			</div>

			<!-- List of 4 Latest Posts -->
			<div class="space-y-4">
				{#each latestFour as item}
					{@const href = getHubPath(item.kind, item.slug)}
					{@const thumbImg = getResponsiveImageProps(item.coverMedia?.secureUrl, {
						alt: item.coverMedia?.altText || item.title,
						isHero: false,
						aspect: '1:1',
						sizes: '64px'
					})}
					<article class="pb-4 border-b border-[#E2E8F0] last:border-0 last:pb-0 flex items-start gap-4 group">
						<!-- 1:1 Thumbnail (Tiny square) -->
						<div class="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-[#E2E8F0]/70">
							{#if thumbImg}
								<!-- Cloudinary auto-format thumbnail with lazy loading -->
								<img
									src={thumbImg.src}
									srcset={thumbImg.srcset}
									sizes={thumbImg.sizes}
									alt={thumbImg.alt}
									width={thumbImg.width}
									height={thumbImg.height}
									loading={thumbImg.loading}
									decoding={thumbImg.decoding}
									class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
								/>
							{:else}
								<div class="w-full h-full bg-linear-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white/50 text-[10px] font-bold">
									NEWS
								</div>
							{/if}
						</div>

						<!-- Title & Date -->
						<div class="flex-1 min-w-0">
							<div class="flex items-center gap-1.5 mb-1">
								<span class="text-[10px] font-bold uppercase tracking-wider text-[#0F766E]">
									{item.category?.name || item.kind}
								</span>
								<span class="text-slate-300">•</span>
								<time datetime={new Date(item.publishedAt || '').toISOString()} class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
									{formatDate(item.publishedAt)}
								</time>
							</div>

							<h3 class="font-serif text-sm sm:text-[15px] font-bold text-[#0F172A] leading-snug line-clamp-2 group-hover:text-[#0F766E] transition">
								<a {href} data-sveltekit-preload-data="hover">{item.title}</a>
							</h3>
						</div>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<!-- C. Newsletter Capture Band (Deep Slate #0F172A, rounded-2xl, centered, 52px form, stacked on mobile) -->
	<section class="bg-[#0F172A] text-white rounded-2xl p-8 sm:p-14 relative overflow-hidden shadow-sm border border-slate-800">
		<!-- Subtle ambient background glow -->
		<div class="absolute -top-24 -right-24 w-96 h-96 bg-[#0F766E]/20 rounded-full blur-3xl pointer-events-none"></div>
		<div class="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

		<div class="relative z-10 max-w-2xl mx-auto text-center space-y-4">
			<span class="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#CCFBF1]/15 text-[#CCFBF1] border border-[#CCFBF1]/30">
				EDITORIAL DISPATCH
			</span>

			<h2 class="font-serif text-2xl sm:text-4xl lg:text-[38px] font-bold tracking-tight text-white leading-tight">
				Independent technical insights, delivered directly to your inbox.
			</h2>

			<!-- Form: flex layout (input + button), stacked on mobile, 52px height -->
			<form method="POST" action="/subscribe" class="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
				<!-- Honeypot anti-bot field (BR-NEWS-01.3) -->
				<input type="text" name="b_url_honeypot" tabindex="-1" autocomplete="off" class="hidden" />

				<!-- Accessible Label for Screen Readers (Lighthouse 100) -->
				<label for="home-subscribe-email" class="sr-only">Email address</label>
				<input
					id="home-subscribe-email"
					type="email"
					name="email"
					required
					autocomplete="email"
					placeholder="Enter your email address…"
					class="h-[52px] w-full sm:flex-1 rounded-xl bg-white text-[#0F172A] text-sm px-4 placeholder-slate-500 shadow-xs border border-transparent focus:outline-hidden focus:ring-2 focus:ring-[#0F766E]"
				/>
				<button
					type="submit"
					class="h-[52px] w-full sm:w-auto px-6 rounded-xl text-sm font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] shadow-xs transition shrink-0"
				>
					Subscribe Now
				</button>
			</form>

			<p class="text-xs text-slate-300 pt-1 text-center">
				By subscribing, you agree to our <a href="/privacy" data-sveltekit-preload-data="hover" class="underline hover:text-white transition">Privacy Policy</a>. No spam, ever.
			</p>
		</div>
	</section>

	<!-- D. Latest News Grid (Desktop lg: 3 cols, Tablet md: 2 cols, Mobile: 1 col, 16:9 images, 2-line excerpts) -->
	<section class="space-y-8">
		<div class="flex items-end justify-between pb-4 border-b border-[#E2E8F0]">
			<div>
				<span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
					EDITORIAL ARCHIVE
				</span>
				<h2 class="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A] mt-1">
					Latest News & Announcements
				</h2>
			</div>
			<a href="/news" data-sveltekit-preload-data="hover" class="text-xs font-semibold text-[#0F766E] hover:underline">
				Browse all news →
			</a>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each data.latestNews as post}
				{@const href = getHubPath(post.kind, post.slug)}
				{@const cardImg = getResponsiveImageProps(post.coverMedia?.secureUrl, {
					alt: post.coverMedia?.altText || post.title,
					isHero: false,
					aspect: '16:9',
					sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px'
				})}
				<article class="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col group">
					<!-- Uniform 16:9 Aspect Video Cover Image (Zero Layout Shift) -->
					<div class="aspect-video w-full overflow-hidden bg-slate-100 border-b border-[#E2E8F0]/60 relative">
						{#if cardImg}
							<!-- Cloudinary auto-format responsive image -->
							<img
								src={cardImg.src}
								srcset={cardImg.srcset}
								sizes={cardImg.sizes}
								alt={cardImg.alt}
								width={cardImg.width}
								height={cardImg.height}
								loading={cardImg.loading}
								decoding={cardImg.decoding}
								class="w-full h-full object-cover group-hover:scale-105 transition duration-500 ease-out"
							/>
						{:else}
							<div class="w-full h-full bg-linear-to-tr from-slate-100 to-slate-200 flex items-center justify-center text-slate-400 text-xs font-semibold">
								{post.category?.name || 'Editorial'}
							</div>
						{/if}
					</div>

					<div class="p-6 flex-1 flex flex-col justify-between">
						<div>
							<!-- Category Pill Badge above title -->
							<div class="flex items-center gap-2 mb-2.5">
								<span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#CCFBF1] text-[#0F766E]">
									{post.category?.name || post.kind}
								</span>
								<span class="text-slate-300">•</span>
								<time datetime={new Date(post.publishedAt || '').toISOString()} class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
									{formatDate(post.publishedAt)}
								</time>
							</div>

							<!-- Serif Title (text-xl font-bold) -->
							<h3 class="font-serif text-xl font-bold text-[#0F172A] leading-snug group-hover:underline group-hover:text-[#0F766E] transition">
								<a {href} data-sveltekit-preload-data="hover">{post.title}</a>
							</h3>

							<!-- 2-Line Excerpt -->
							{#if post.excerpt}
								<p class="mt-2 text-sm text-[#475569] leading-relaxed line-clamp-2">
									{post.excerpt}
								</p>
							{/if}
						</div>

						<!-- Footer Row: Author, Date, Read Time -->
						<div class="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-slate-500">
							<span class="font-medium text-[#0F172A]">{post.author.name}</span>
							<span>{post.readingMinutes} min read</span>
						</div>
					</div>
				</article>
			{/each}
		</div>
	</section>

	<!-- E. Changelog Section (Timeline / list view with left vertical line and node dots) -->
	{#if data.changelogPosts && data.changelogPosts.length > 0}
		<section class="space-y-8">
			<div class="flex items-end justify-between pb-4 border-b border-[#E2E8F0]">
				<div>
					<span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
						PRODUCT UPDATES
					</span>
					<h2 class="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A] mt-1">
						Continuous Changelog
					</h2>
				</div>
				<a href="/changelog" data-sveltekit-preload-data="hover" class="text-xs font-semibold text-[#0F766E] hover:underline">
					View changelog timeline →
				</a>
			</div>

			<!-- Timeline list with left vertical line and node dots -->
			<div class="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2 sm:before:left-2.5 before:top-3 before:bottom-3 before:w-[2px] before:bg-[#E2E8F0]">
				{#each data.changelogPosts as cl}
					{@const badge = getChangelogBadge(cl.changelogType)}
					<div class="relative bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs hover:shadow-sm transition group">
						<!-- Timeline node dot -->
						<div class="absolute -left-[29px] sm:-left-[35px] top-7 w-3 h-3 rounded-full bg-[#0F766E] border-2 border-[#F8F7F4] shadow-xs"></div>

						<div class="flex flex-col md:flex-row md:items-baseline md:justify-between gap-4">
							<div class="space-y-1.5 flex-1">
								<div class="flex items-center gap-2.5">
									<span class={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${badge.class}`}>
										{badge.label}
									</span>
									<time datetime={new Date(cl.publishedAt || '').toISOString()} class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
										{formatDate(cl.publishedAt)}
									</time>
								</div>

								<h3 class="font-serif text-lg font-bold text-[#0F172A] group-hover:text-[#0F766E] transition">
									<a href={`/changelog#${cl.slug}`} data-sveltekit-preload-data="hover">{cl.title}</a>
								</h3>

								{#if cl.excerpt}
									<p class="text-sm text-[#475569] leading-relaxed line-clamp-2 max-w-3xl">
										{cl.excerpt}
									</p>
								{/if}
							</div>

							<a
								href={`/changelog#${cl.slug}`}
								data-sveltekit-preload-data="hover"
								class="text-xs font-semibold text-[#0F766E] hover:underline shrink-0"
							>
								Release notes →
							</a>
						</div>
					</div>
				{/each}
			</div>
		</section>
	{/if}
</div>
