<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const post = $derived(data.post);
</script>

<svelte:head>
	<title>[PREVIEW] {post.title} — AI Tathastu</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="bg-amber-500 text-slate-900 px-4 py-2.5 text-xs font-bold text-center sticky top-0 z-50 shadow-xs flex items-center justify-center gap-3">
	<span>⚠️ PREVIEW MODE — This is a draft snapshot. It is not publicly visible.</span>
	<a href={`/admin/posts/${post.id}`} class="underline hover:text-white">Return to Editor</a>
</div>

<article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
	<div class="space-y-4">
		<div class="flex items-center gap-2">
			<span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-900 text-white">
				Draft ({post.kind})
			</span>
			{#if post.category}
				<span class="text-xs font-semibold text-indigo-600">{post.category.name}</span>
			{/if}
		</div>

		<h1 class="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
			{post.title}
		</h1>

		{#if post.excerpt}
			<p class="text-lg sm:text-xl text-slate-600 font-serif leading-relaxed">
				{post.excerpt}
			</p>
		{/if}

		<div class="pt-4 border-t border-slate-200 flex items-center gap-3 text-xs text-slate-500">
			<span>By <strong>{post.author.name}</strong></span>
			<span>•</span>
			<span>Status: <strong class="uppercase text-amber-700">{post.status}</strong></span>
			<span>•</span>
			<span>{post.readingMinutes} min read</span>
		</div>
	</div>

	{#if post.coverMedia}
		<div class="rounded-3xl overflow-hidden aspect-16/9 bg-slate-100 border border-slate-200">
			<img src={post.coverMedia.secureUrl} alt={post.coverMedia.altText || post.title} class="w-full h-full object-cover" />
		</div>
	{/if}

	<div class="prose prose-lg prose-slate max-w-none font-serif leading-relaxed text-slate-800">
		{@html post.contentHtml}
	</div>
</article>
