<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function getHubPath(kind: string, slug: string) {
		const map: Record<string, string> = {
			article: 'news',
			announcement: 'news',
			newsletter: 'newsletter',
			changelog: 'changelog'
		};
		return `/${map[kind] || 'news'}/${slug}`;
	}

	function formatDate(d: any) {
		if (!d) return '';
		return new Date(d).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		}).toUpperCase();
	}
</script>

<svelte:head>
	<title>{data.category.name} Articles — AI Tathastu Insights</title>
	<meta name="description" content={`Articles and insights filed under ${data.category.name}.`} />
	<link rel="canonical" href={`https://aitathastu.info/category/${data.category.slug}`} />
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
	<!-- Header -->
	<div class="border-b border-[#E2E8F0] pb-8">
		<span class="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
			TOPIC CATEGORY
		</span>
		<h1 class="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#0F172A] tracking-tight mt-1">
			{data.category.name}
		</h1>
		{#if data.category.description}
			<p class="text-base text-[#475569] mt-3 max-w-2xl leading-relaxed">
				{data.category.description}
			</p>
		{/if}
	</div>

	{#if data.posts.length === 0}
		<div class="p-16 bg-white rounded-xl border border-[#E2E8F0] text-center text-slate-400 text-sm">
			No articles published in this category yet.
		</div>
	{:else}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each data.posts as post}
				{@const href = getHubPath(post.kind, post.slug)}
				<article class="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group">
					<div>
						<div class="aspect-16/9 bg-slate-100 overflow-hidden relative">
							{#if post.coverMedia}
								<img
									src={post.coverMedia.secureUrl}
									alt={post.coverMedia.altText || post.title}
									class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
								/>
							{:else}
								<div class="w-full h-full bg-linear-to-tr from-slate-100 to-slate-200 flex items-center justify-center text-slate-400 text-xs font-semibold">
									{data.category.name}
								</div>
							{/if}
						</div>
						<div class="p-6">
							<div class="flex items-center gap-2 mb-2">
								<span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#CCFBF1] text-[#0F766E]">
									{post.kind}
								</span>
								<span class="text-slate-300">•</span>
								<time datetime={new Date(post.publishedAt || '').toISOString()} class="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
									{formatDate(post.publishedAt)}
								</time>
							</div>
							<h3 class="font-serif text-[22px] font-semibold text-[#0F172A] leading-[1.3] group-hover:text-[#0F766E] group-hover:underline transition">
								<a {href}>{post.title}</a>
							</h3>
							{#if post.excerpt}
								<p class="mt-2 text-[15px] text-[#475569] line-clamp-3 leading-relaxed">
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
</div>
