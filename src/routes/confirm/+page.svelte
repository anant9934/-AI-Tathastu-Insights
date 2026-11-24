<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Subscription Confirmed — AI Tathastu Insights</title>
</svelte:head>

<div class="max-w-lg mx-auto px-4 py-20 sm:py-28 text-center space-y-6">
	{#if data.success}
		<div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold shadow-xs">
			✓
		</div>

		<h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">
			Subscription Confirmed!
		</h1>

		<p class="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
			Thank you for verifying your email address. You will now receive technical deep-dives and newsletter releases from AI Tathastu Insights.
		</p>

		<div class="pt-4">
			<a
				href="/"
				class="inline-flex px-6 py-3 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition shadow-xs"
			>
				Explore Latest Publications →
			</a>
		</div>
	{:else}
		<div class="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold shadow-xs">
			!
		</div>

		<h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">
			Confirmation Failed
		</h1>

		<p class="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
			{data.error}
		</p>

		<div class="pt-4">
			<a
				href="/subscribe"
				class="inline-flex px-6 py-3 rounded-xl text-xs font-bold text-slate-900 bg-white border border-slate-300 hover:bg-slate-50 transition shadow-xs"
			>
				Subscribe Again →
			</a>
		</div>
	{/if}
</div>
