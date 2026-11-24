<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { formatDate, getResponsiveImageProps } from '#lib/utils';

	let { data }: { data: PageData } = $props();
	const post = $derived(data.post);

	let readingProgress = $state(0);
	let copied = $state(false);

	// Extract H2 headings for Table of Contents (BR-PUB-03.3)
	const headings = $derived.by(() => {
		if (!post.contentHtml) return [];
		const regex = /<h2[^>]*>(.*?)<\/h2>/gi;
		const matches: { id: string; text: string }[] = [];
		let match;
		while ((match = regex.exec(post.contentHtml)) !== null) {
			const text = match[1].replace(/<[^>]+>/g, '').trim();
			const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
			if (text) matches.push({ id, text });
		}
		return matches;
	});

	// Word count check for reading progress indicator (BR-PUB-03.2)
	const isLongArticle = $derived((post.contentText?.split(/\s+/).length || 0) > 1000);

	onMount(() => {
		if (!isLongArticle) return;

		// INP Optimization: Throttle scroll recalculations with requestAnimationFrame to prevent forced reflows
		let ticking = false;
		function handleScroll() {
			if (!ticking) {
				window.requestAnimationFrame(() => {
					const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
					if (totalHeight > 0) {
						readingProgress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
					}
					ticking = false;
				});
				ticking = true;
			}
		}

		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	});

	function copyUrl() {
		if (typeof navigator !== 'undefined') {
			navigator.clipboard.writeText(window.location.href);
			copied = true;
			setTimeout(() => copied = false, 2000);
		}
	}

	const canonicalUrl = $derived(`https://aitathastu.info/${data.hub}/${post.slug}`);
	const ogImage = $derived(post.coverMedia?.secureUrl || 'https://aitathastu.info/og-default.png');
</script>

<svelte:head>
	<title>{post.seoTitle || post.title} — AI Tathastu Insights</title>
	<meta name="description" content={post.seoDescription || post.excerpt || ''} />
	<link rel="canonical" href={canonicalUrl} />

	<!-- OpenGraph & Twitter Cards (BR-PUB-12.1) -->
	<meta property="og:title" content={post.seoTitle || post.title} />
	<meta property="og:description" content={post.seoDescription || post.excerpt || ''} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:type" content="article" />
	<meta property="og:image" content={ogImage} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={post.seoTitle || post.title} />
	<meta name="twitter:description" content={post.seoDescription || post.excerpt || ''} />
	<meta name="twitter:image" content={ogImage} />

	<!-- JSON-LD Article Schema (BR-PUB-12.2) -->
	{@html `<script type="application/ld+json">
	{
		"@context": "https://schema.org",
		"@type": "Article",
		"headline": "${post.title.replace(/"/g, '\\"')}",
		"description": "${(post.excerpt || '').replace(/"/g, '\\"')}",
		"datePublished": "${post.publishedAt ? new Date(post.publishedAt).toISOString() : ''}",
		"dateModified": "${new Date(post.updatedAt).toISOString()}",
		"mainEntityOfPage": "${canonicalUrl}",
		"image": "${ogImage}",
		"author": {
			"@type": "Person",
			"name": "${post.author.name}"
		},
		"publisher": {
			"@type": "Organization",
			"name": "AI Tathastu Insights",
			"url": "https://aitathastu.info"
		}
	}
	<\/script>`}
</svelte:head>

<!-- Reading progress bar for articles > 1,000 words in Deep Teal (BR-PUB-03.2) -->
{#if isLongArticle}
	<div class="fixed top-16 left-0 right-0 h-1 bg-[#E2E8F0] z-40">
		<div class="h-full bg-[#0F766E] transition-all duration-150" style={`width: ${readingProgress}%`}></div>
	</div>
{/if}

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
	<!-- Breadcrumbs & Category Pill -->
	<nav class="flex items-center gap-2 text-xs font-semibold text-slate-500">
		<a href="/" data-sveltekit-preload-data="hover" class="hover:text-[#0F172A] transition">Home</a>
		<span>/</span>
		<a href={`/${data.hub}`} data-sveltekit-preload-data="hover" class="capitalize hover:text-[#0F172A] transition">{data.hub}</a>
		{#if post.category}
			<span>/</span>
			<a href={`/category/${post.category.slug}`} data-sveltekit-preload-data="hover" class="text-[#0F766E] hover:underline">
				{post.category.name}
			</a>
		{/if}
	</nav>

	<!-- Article Header -->
	<header class="space-y-6">
		<div class="flex items-center gap-2">
			<span class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-[#CCFBF1] text-[#0F766E]">
				{post.category?.name || post.kind}
			</span>
			<span class="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
				EDITORIAL
			</span>
		</div>

		<h1 class="font-serif text-3xl sm:text-4xl lg:text-[46px] font-semibold text-[#0F172A] tracking-tight leading-[1.18]">
			{post.title}
		</h1>

		{#if post.excerpt}
			<p class="text-lg sm:text-xl text-[#475569] font-serif leading-relaxed">
				{post.excerpt}
			</p>
		{/if}

		<!-- Author Byline & Publish Date -->
		<div class="pt-6 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-4 text-xs text-[#475569]">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-full bg-[#0F766E] text-white font-serif font-bold flex items-center justify-center text-sm shadow-xs">
					{post.author.name.charAt(0)}
				</div>
				<div>
					<p class="font-semibold text-[#0F172A] text-sm leading-tight">{post.author.name}</p>
					<div class="flex items-center gap-2 text-slate-400 text-[11px] mt-0.5">
						<time datetime={new Date(post.publishedAt || '').toISOString()} class="uppercase tracking-widest font-semibold">
							{formatDate(post.publishedAt)}
						</time>
						<span>•</span>
						<span>{post.readingMinutes} min read</span>
					</div>
				</div>
			</div>

			<!-- Share Actions -->
			<div class="flex items-center gap-2">
				<button
					type="button"
					onclick={copyUrl}
					class="px-3.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-xs font-semibold text-[#475569] hover:bg-slate-50 transition shadow-xs"
				>
					{copied ? '✓ Link Copied' : 'Copy Link'}
				</button>
				<a
					href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(canonicalUrl)}`}
					target="_blank"
					rel="noopener noreferrer"
					class="p-2 rounded-lg border border-[#E2E8F0] bg-white text-[#475569] hover:bg-slate-50 transition text-xs font-bold shadow-xs"
					aria-label="Share on X"
				>
					𝕏
				</a>
			</div>
		</div>
	</header>

	<!-- Cover Image Hero (16:9 Aspect Video with Preload / High Priority) -->
	{#if post.coverMedia}
		{@const coverImg = getResponsiveImageProps(post.coverMedia.secureUrl, {
			alt: post.coverMedia.altText || post.title,
			isHero: true,
			aspect: '16:9'
		})}
		<figure class="rounded-xl overflow-hidden border border-[#E2E8F0] bg-slate-100 shadow-xs aspect-video">
			{#if coverImg}
				<img
					src={coverImg.src}
					srcset={coverImg.srcset}
					sizes={coverImg.sizes}
					alt={coverImg.alt}
					width={coverImg.width}
					height={coverImg.height}
					loading={coverImg.loading}
					fetchpriority={coverImg.fetchpriority}
					decoding={coverImg.decoding}
					class="w-full h-full object-cover"
				/>
			{/if}
			{#if post.coverMedia.altText && !post.coverMedia.decorative}
				<figcaption class="p-3 text-xs text-slate-500 text-center italic bg-white border-t border-[#E2E8F0]">
					{post.coverMedia.altText}
				</figcaption>
			{/if}
		</figure>
	{/if}

	<!-- Layout with TOC if >= 3 H2 headings (BR-PUB-03.3) -->
	<div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pt-4">
		{#if headings.length >= 3}
			<aside class="hidden lg:block lg:col-span-4 sticky top-24 p-6 bg-white rounded-xl border border-[#E2E8F0] shadow-xs text-xs space-y-3">
				<h4 class="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
					ON THIS PAGE
				</h4>
				<ul class="space-y-2 border-l border-[#E2E8F0] pl-3">
					{#each headings as h}
						<li>
							<a href={`#${h.id}`} class="text-[#475569] hover:text-[#0F766E] transition block leading-relaxed">
								{h.text}
							</a>
						</li>
					{/each}
				</ul>
			</aside>
		{/if}

		<!-- Sanitized Body Content -->
		<div class={`${headings.length >= 3 ? 'lg:col-span-8' : 'lg:col-span-12'} prose prose-lg prose-slate max-w-none font-sans leading-relaxed text-[#0F172A]`}>
			{@html post.contentHtml}
		</div>
	</div>

	<!-- Inline Subscriber Box at Article End (Module NEWS) -->
	<section class="bg-white rounded-xl p-8 sm:p-10 border border-[#E2E8F0] shadow-xs space-y-4">
		<span class="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
			STAY INFORMED
		</span>
		<h3 class="font-serif text-2xl font-semibold text-[#0F172A]">
			Enjoyed this piece? Subscribe for future dispatches.
		</h3>
		<p class="text-sm text-[#475569]">
			Get our latest technical articles and newsletters delivered straight to your email. Double opt-in consent, instant unsubscribe.
		</p>
		<form method="POST" action="/subscribe" class="flex flex-col sm:flex-row gap-3 max-w-md pt-2">
			<input type="text" name="b_url_honeypot" tabindex="-1" autocomplete="off" class="hidden" />
			<label for="article-subscribe-email" class="sr-only">Email address</label>
			<input
				id="article-subscribe-email"
				type="email"
				name="email"
				required
				autocomplete="email"
				placeholder="Your email address…"
				class="h-[48px] flex-1 rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm text-[#0F172A] placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-[#0F766E]"
			/>
			<button
				type="submit"
				class="h-[48px] px-6 rounded-xl bg-[#0F766E] text-white font-semibold text-sm hover:bg-[#115E59] transition shrink-0 shadow-xs"
			>
				Subscribe
			</button>
		</form>
	</section>

	<!-- Related Content (FR-PUB-06) -->
	{#if data.related.length > 0}
		<section class="pt-10 border-t border-[#E2E8F0] space-y-6">
			<h3 class="font-serif text-2xl font-semibold text-[#0F172A]">Related Reading</h3>
			<div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
				{#each data.related as rel}
					{@const relImg = getResponsiveImageProps(rel.coverMedia?.secureUrl, {
						alt: rel.coverMedia?.altText || rel.title,
						isHero: false,
						aspect: '16:9',
						sizes: '(max-width: 768px) 100vw, 300px'
					})}
					<article class="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group">
						<div>
							<div class="aspect-video bg-slate-100 overflow-hidden relative">
								{#if relImg}
									<img
										src={relImg.src}
										srcset={relImg.srcset}
										sizes={relImg.sizes}
										alt={relImg.alt}
										width={relImg.width}
										height={relImg.height}
										loading={relImg.loading}
										decoding={relImg.decoding}
										class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
									/>
								{:else}
									<div class="w-full h-full bg-linear-to-tr from-slate-100 to-slate-200 flex items-center justify-center text-slate-400 text-xs font-semibold">
										Article
									</div>
								{/if}
							</div>
							<div class="p-5">
								<h4 class="font-serif text-lg font-semibold text-[#0F172A] group-hover:text-[#0F766E] transition leading-snug">
									<a href={`/${data.hub}/${rel.slug}`} data-sveltekit-preload-data="hover">{rel.title}</a>
								</h4>
								{#if rel.excerpt}
									<p class="mt-2 text-xs text-[#475569] line-clamp-2 leading-relaxed">
										{rel.excerpt}
									</p>
								{/if}
							</div>
						</div>
						<div class="px-5 py-3 border-t border-[#E2E8F0] text-[11px] text-slate-400">
							{rel.readingMinutes} min read
						</div>
					</article>
				{/each}
			</div>
		</section>
	{/if}
</div>
