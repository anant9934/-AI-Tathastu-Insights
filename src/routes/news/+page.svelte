<script lang="ts">
	import type { PageData } from './$types';
	import { formatDate, getResponsiveImageProps } from '#lib/utils';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Company News & Press — AI Tathastu Insights</title>
	<meta name="description" content="Official company news, product announcements, and architectural insights from the team at AI Tathastu." />
	<link rel="canonical" href="https://aitathastu.info/news" />
	<meta property="og:title" content="Company News & Press — AI Tathastu Insights" />
	<meta property="og:description" content="Official company news and announcements." />
	<meta property="og:url" content="https://aitathastu.info/news" />
	<meta property="og:type" content="website" />
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
	<!-- Hub Header -->
	<div class="border-b border-[#E2E8F0] pb-8">
		<span class="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
			EDITORIAL HUB
		</span>
		<h1 class="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#0F172A] tracking-tight mt-1">
			Company News & Announcements
		</h1>
		<p class="text-base text-[#475569] mt-3 max-w-2xl leading-relaxed">
			Official company announcements, engineering breakthroughs, research whitepapers, and operational updates.
		</p>

		<!-- Category Filter Pills -->
		<div class="flex items-center gap-2 mt-8 overflow-x-auto text-xs pb-1">
			<a
				href="/news"
				data-sveltekit-preload-data="hover"
				class={`px-3.5 py-1.5 rounded-full font-semibold transition ${
					!data.selectedCategory
						? 'bg-[#0F766E] text-white shadow-xs'
						: 'bg-white text-[#475569] border border-[#E2E8F0] hover:bg-slate-50'
				}`}
			>
				All Topics
			</a>
			{#each data.categories as cat}
				<a
					href={`/news?category=${cat.slug}`}
					data-sveltekit-preload-data="hover"
					class={`px-3.5 py-1.5 rounded-full font-semibold transition whitespace-nowrap ${
						data.selectedCategory === cat.slug
							? 'bg-[#0F766E] text-white shadow-xs'
							: 'bg-white text-[#475569] border border-[#E2E8F0] hover:bg-slate-50'
					}`}
				>
					{cat.name}
				</a>
			{/each}
		</div>
	</div>

	<!-- Featured News Story -->
	{#if data.featured}
		{@const featuredImg = getResponsiveImageProps(data.featured.coverMedia?.secureUrl, {
			alt: data.featured.coverMedia?.altText || data.featured.title,
			isHero: true,
			aspect: '16:9'
		})}
		<section>
			<article class="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-xs hover:shadow-md transition group grid grid-cols-1 lg:grid-cols-12 items-center">
				<div class="lg:col-span-7 aspect-video overflow-hidden bg-slate-100 relative">
					{#if featuredImg}
						<img
							src={featuredImg.src}
							srcset={featuredImg.srcset}
							sizes={featuredImg.sizes}
							alt={featuredImg.alt}
							width={featuredImg.width}
							height={featuredImg.height}
							loading={featuredImg.loading}
							fetchpriority={featuredImg.fetchpriority}
							decoding={featuredImg.decoding}
							class="w-full h-full object-cover group-hover:scale-[1.02] transition duration-500"
						/>
					{:else}
						<div class="w-full h-full bg-linear-to-br from-slate-800 to-teal-900 flex items-center justify-center text-white/50 text-xl font-serif">
							Featured Story
						</div>
					{/if}
				</div>
				<div class="lg:col-span-5 p-8 sm:p-10 space-y-4">
					<div class="flex items-center gap-2">
						<span class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-[#CCFBF1] text-[#0F766E]">
							{data.featured.category?.name || 'Company News'}
						</span>
						<span class="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
							FEATURED
						</span>
					</div>
					<h2 class="font-serif text-2xl sm:text-3xl font-semibold text-[#0F172A] leading-tight group-hover:text-[#0F766E] transition">
						<a href={`/news/${data.featured.slug}`} data-sveltekit-preload-data="hover">{data.featured.title}</a>
					</h2>
					{#if data.featured.excerpt}
						<p class="text-sm sm:text-base text-[#475569] leading-relaxed line-clamp-3">
							{data.featured.excerpt}
						</p>
					{/if}
					<div class="pt-2 flex items-center gap-3 text-xs text-slate-400">
						<span class="font-medium text-[#0F172A]">{data.featured.author.name}</span>
						<span>•</span>
						<time datetime={new Date(data.featured.publishedAt || '').toISOString()} class="uppercase tracking-widest text-[11px]">
							{formatDate(data.featured.publishedAt)}
						</time>
					</div>
				</div>
			</article>
		</section>
	{/if}

	<!-- News Card Grid (Bounded to <= 12 items for DOM Performance) -->
	{#if data.posts.length === 0}
		<div class="p-16 bg-white rounded-xl border border-[#E2E8F0] text-center text-slate-400 text-sm">
			No articles match this criteria yet.
		</div>
	{:else}
		<section class="space-y-12">
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
				{#each data.posts as post}
					{@const postImg = getResponsiveImageProps(post.coverMedia?.secureUrl, {
						alt: post.coverMedia?.altText || post.title,
						isHero: false,
						aspect: '16:9',
						sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px'
					})}
					<article class="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col group">
						<div class="aspect-video overflow-hidden bg-slate-100 relative">
							{#if postImg}
								<img
									src={postImg.src}
									srcset={postImg.srcset}
									sizes={postImg.sizes}
									alt={postImg.alt}
									width={postImg.width}
									height={postImg.height}
									loading={postImg.loading}
									decoding={postImg.decoding}
									class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
								/>
							{:else}
								<div class="w-full h-full bg-linear-to-tr from-slate-100 to-slate-200 flex items-center justify-center text-slate-400 text-xs font-semibold">
									{post.category?.name || 'News'}
								</div>
							{/if}
						</div>
						<div class="p-6 flex-1 flex flex-col justify-between">
							<div>
								<div class="flex items-center gap-2 mb-2">
									<span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#CCFBF1] text-[#0F766E]">
										{post.category?.name || 'News'}
									</span>
									<span class="text-slate-300">•</span>
									<time datetime={new Date(post.publishedAt || '').toISOString()} class="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
										{formatDate(post.publishedAt)}
									</time>
								</div>
								<h3 class="font-serif text-[22px] font-semibold text-[#0F172A] leading-[1.3] group-hover:text-[#0F766E] group-hover:underline transition">
									<a href={`/news/${post.slug}`} data-sveltekit-preload-data="hover">{post.title}</a>
								</h3>
								{#if post.excerpt}
									<p class="mt-2 text-[15px] text-[#475569] leading-relaxed line-clamp-2">
										{post.excerpt}
									</p>
								{/if}
							</div>
							<div class="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-slate-400">
								<span class="font-medium text-[#0F172A]">{post.author.name}</span>
								<span>{post.readingMinutes} min read</span>
							</div>
						</div>
					</article>
				{/each}
			</div>

			<!-- Keyset (Cursor-based) Pagination for O(1) Index Scan -->
			{#if data.nextCursor}
				<div class="pt-8 flex justify-center">
					<a
						href={`/news?cursor=${encodeURIComponent(data.nextCursor)}${data.selectedCategory ? `&category=${data.selectedCategory}` : ''}`}
						data-sveltekit-preload-data="hover"
						class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-[#E2E8F0] text-sm font-semibold text-[#0F172A] hover:bg-slate-50 hover:border-slate-300 shadow-xs transition"
					>
						<span>Load More Articles</span>
						<span>→</span>
					</a>
				</div>
			{/if}
		</section>
	{/if}
</div>
