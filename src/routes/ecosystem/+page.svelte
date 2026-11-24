<script lang="ts">
	import type { PageData } from './$types';
	import { formatDate, getResponsiveImageProps } from '#lib/utils';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Ecosystem & Integrations — AI Tathastu Insights</title>
	<meta name="description" content="Discover ecosystem partners, integrations, and community developments from AI Tathastu." />
	<link rel="canonical" href="https://aitathastu.info/ecosystem" />
	<meta property="og:title" content="Ecosystem & Integrations — AI Tathastu Insights" />
	<meta property="og:description" content="Collaborations, ecosystem initiatives, and integration showcases across the industry." />
</svelte:head>

<div class="max-w-7xl mx-auto px-4 md:px-8 py-16 lg:py-24 space-y-16">
	<!-- Hub Header -->
	<div class="border-b border-[#E2E8F0] pb-8">
		<span class="text-[11px] font-bold uppercase tracking-wider text-slate-500">
			PARTNER NETWORK
		</span>
		<h1 class="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] tracking-tight mt-1">
			Ecosystem & Integrations
		</h1>
		<p class="text-base text-[#475569] mt-3 max-w-2xl leading-relaxed">
			Collaborations, ecosystem initiatives, open specifications, and integration showcases across the industry.
		</p>
	</div>

	<!-- Featured Ecosystem Story -->
	{#if data.featured}
		{@const featImg = getResponsiveImageProps(data.featured.coverMedia?.secureUrl, {
			alt: data.featured.coverMedia?.altText || data.featured.title,
			isHero: true,
			aspect: '16:9'
		})}
		<section>
			<article class="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-xs hover:shadow-md transition group grid grid-cols-1 lg:grid-cols-12 items-center">
				<div class="lg:col-span-7 aspect-video overflow-hidden bg-slate-100 relative">
					{#if featImg}
						<img
							src={featImg.src}
							srcset={featImg.srcset}
							sizes={featImg.sizes}
							alt={featImg.alt}
							width={featImg.width}
							height={featImg.height}
							loading={featImg.loading}
							fetchpriority={featImg.fetchpriority}
							decoding={featImg.decoding}
							class="w-full h-full object-cover group-hover:scale-[1.02] transition duration-500 ease-out"
						/>
					{:else}
						<div class="w-full h-full bg-linear-to-br from-slate-800 to-teal-900 flex items-center justify-center text-white/50 text-xl font-serif">
							Ecosystem Spotlight
						</div>
					{/if}
				</div>
				<div class="lg:col-span-5 p-8 sm:p-10 space-y-4">
					<div class="flex items-center gap-2">
						<span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#CCFBF1] text-[#0F766E]">
							ECOSYSTEM
						</span>
						<span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
							FEATURED
						</span>
					</div>
					<h2 class="font-serif text-2xl sm:text-3xl font-bold text-[#0F172A] leading-tight group-hover:text-[#0F766E] transition">
						<a href={`/ecosystem/${data.featured.slug}`} data-sveltekit-preload-data="hover">{data.featured.title}</a>
					</h2>
					{#if data.featured.excerpt}
						<p class="text-sm sm:text-base text-[#475569] leading-relaxed line-clamp-3">
							{data.featured.excerpt}
						</p>
					{/if}
					<div class="pt-2 flex items-center gap-3 text-xs text-slate-400">
						<span class="font-medium text-[#0F172A]">{data.featured.author.name}</span>
						<span>•</span>
						<time datetime={new Date(data.featured.publishedAt || '').toISOString()} class="uppercase tracking-wider text-[11px] font-semibold">
							{formatDate(data.featured.publishedAt)}
						</time>
						<span>•</span>
						<span>{data.featured.readingMinutes} min read</span>
					</div>
				</div>
			</article>
		</section>
	{/if}

	<!-- Ecosystem & Partner Dispatches Grid -->
	<section class="space-y-8">
		<div class="flex items-end justify-between pb-4 border-b border-[#E2E8F0]">
			<div>
				<span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
					ALL DISPATCHES
				</span>
				<h2 class="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A] mt-1">
					Partner Showcases & Technical Notes
				</h2>
			</div>
		</div>

		{#if data.posts.length === 0}
			<div class="p-16 bg-white rounded-xl border border-[#E2E8F0] text-center text-slate-400 text-sm">
				No additional ecosystem articles published yet.
			</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{#each data.posts as post}
					{@const postImg = getResponsiveImageProps(post.coverMedia?.secureUrl, {
						alt: post.coverMedia?.altText || post.title,
						isHero: false,
						aspect: '16:9',
						sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px'
					})}
					<article class="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group">
						<div>
							<!-- 16:9 Cover Image -->
							<div class="aspect-video w-full bg-slate-100 overflow-hidden relative border-b border-[#E2E8F0]/60">
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
										class="w-full h-full object-cover group-hover:scale-105 transition duration-500 ease-out"
									/>
								{:else}
									<div class="w-full h-full bg-gradient-to-tr from-slate-800 to-teal-900 flex items-center justify-center text-white/50 font-serif text-lg">
										Ecosystem
									</div>
								{/if}
							</div>
							<div class="p-6">
								<div class="flex items-center gap-2 mb-2.5">
									<span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#CCFBF1] text-[#0F766E]">
										ECOSYSTEM
									</span>
									<span class="text-slate-300">•</span>
									<time datetime={new Date(post.publishedAt || '').toISOString()} class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
										{formatDate(post.publishedAt)}
									</time>
								</div>
								<h3 class="font-serif text-xl font-bold text-[#0F172A] leading-snug group-hover:text-[#0F766E] group-hover:underline transition">
									<a href={`/ecosystem/${post.slug}`} data-sveltekit-preload-data="hover">{post.title}</a>
								</h3>
								{#if post.excerpt}
									<p class="mt-2 text-sm text-[#475569] line-clamp-2 leading-relaxed">
										{post.excerpt}
									</p>
								{/if}
							</div>
						</div>

						<div class="px-6 py-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-slate-400">
							<span class="font-medium text-[#0F172A]">{post.author.name}</span>
							<span>{post.readingMinutes} min read</span>
						</div>
					</article>
				{/each}
			</div>
		{/if}
	</section>
</div>
