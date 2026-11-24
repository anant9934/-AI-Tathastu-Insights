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
</script>

<svelte:head>
	<title>Search Articles — AI Tathastu Insights</title>
	<!-- noindex as required by BR-PUB-08.4 -->
	<meta name="robots" content="noindex, follow" />
</svelte:head>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
	<!-- Search Header & Input Form -->
	<div class="space-y-4">
		<span class="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
			SEARCH DISCOVERY
		</span>
		<h1 class="font-serif text-3xl sm:text-4xl font-semibold text-[#0F172A] tracking-tight">
			Search Publications
		</h1>
		<form method="GET" class="relative">
			<label for="search-input" class="sr-only">Search query</label>
			<input
				id="search-input"
				type="search"
				name="q"
				value={data.query}
				aria-label="Search by keywords, titles, or concepts"
				placeholder="Search by keywords, titles, or concepts…"
				class="w-full rounded-xl border border-[#E2E8F0] py-3.5 pl-12 pr-4 text-sm text-[#0F172A] placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-[#0F766E] bg-white shadow-xs"
			/>
			<svg class="w-5 h-5 text-slate-400 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
			</svg>
		</form>
	</div>

	<!-- Results / Prompts -->
	{#if data.rateLimited}
		<div class="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
			Too many search queries. Please wait a minute before searching again.
		</div>
	{:else if data.tooShort}
		<div class="p-8 text-center text-slate-500 bg-white rounded-xl border border-[#E2E8F0] shadow-xs">
			<p class="text-sm font-medium">Please enter at least 2 characters to search.</p>
		</div>
	{:else if data.results.length === 0}
		<!-- Zero Results (BR-PUB-08.2) -->
		<div class="p-8 bg-white rounded-xl border border-[#E2E8F0] shadow-xs space-y-6">
			<div>
				<h2 class="font-serif text-lg font-semibold text-[#0F172A]">
					No matching stories found for "{data.query}"
				</h2>
				<p class="text-xs text-[#475569] mt-1">
					Try checking for typos or searching with broader keywords.
				</p>
			</div>

			{#if data.prompts && data.prompts.length > 0}
				<div class="space-y-3 pt-4 border-t border-[#E2E8F0]">
					<h3 class="text-xs font-semibold uppercase tracking-wider text-slate-500">
						Suggested Stories
					</h3>
					<div class="divide-y divide-[#E2E8F0]">
						{#each data.prompts as prompt}
							{@const href = getHubPath(prompt.kind, prompt.slug)}
							<div class="py-2.5 first:pt-0 last:pb-0">
								<a {href} class="font-serif text-sm font-semibold text-[#0F172A] hover:text-[#0F766E] transition">
									{prompt.title}
								</a>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	{:else}
		<!-- Results List -->
		<div class="space-y-4">
			<p class="text-xs font-semibold uppercase tracking-wider text-slate-500">
				Found {data.results.length} result{data.results.length === 1 ? '' : 's'} for "{data.query}"
			</p>

			<div class="space-y-4">
				{#each data.results as item}
					{@const href = getHubPath(item.kind, item.slug)}
					<article class="p-6 bg-white rounded-xl border border-[#E2E8F0] shadow-xs hover:shadow-md hover:-translate-y-0.5 transition group">
						<div class="flex items-center gap-2 mb-2">
							<span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#CCFBF1] text-[#0F766E]">
								{item.kind}
							</span>
							{#if item.category}
								<span class="text-slate-300">•</span>
								<span class="text-xs font-semibold text-[#0F766E]">
									{item.category.name}
								</span>
							{/if}
						</div>
						<h3 class="font-serif text-xl font-semibold text-[#0F172A] group-hover:text-[#0F766E] transition">
							<a {href}>{item.title}</a>
						</h3>
						{#if item.excerpt}
							<p class="mt-2 text-sm text-[#475569] line-clamp-2 leading-relaxed">
								{item.excerpt}
							</p>
						{/if}
					</article>
				{/each}
			</div>
		</div>
	{/if}
</div>
