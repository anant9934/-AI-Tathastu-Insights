<script lang="ts">
	import { page } from '$app/state';

	const status = $derived(page.status);
	const message = $derived(page.error?.message || 'Page not found');
</script>

<svelte:head>
	<title>{status} Error — AI Tathastu Insights</title>
</svelte:head>

<div class="max-w-3xl mx-auto px-4 py-24 sm:py-32 text-center space-y-6">
	<span class="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
		Status {status}
	</span>

	<h1 class="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
		{#if status === 404}
			Story or Page Not Found
		{:else if status === 410}
			This Publication Has Been Archived
		{:else}
			Something Went Wrong
		{/if}
	</h1>

	<p class="text-sm sm:text-base text-slate-600 max-w-md mx-auto leading-relaxed">
		{#if status === 404}
			The article or page you are looking for may have been unpublished, moved, or does not exist.
		{:else if status === 410}
			This post has been archived permanently by the editorial team.
		{:else}
			{message}
		{/if}
	</p>

	<div class="pt-4 flex flex-wrap items-center justify-center gap-3">
		<a
			href="/"
			class="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition shadow-xs"
		>
			Return Home
		</a>
		<a
			href="/news"
			class="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition shadow-xs"
		>
			Explore News & Articles →
		</a>
	</div>
</div>
