<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
	<title>Unsubscribe — AI Tathastu Insights</title>
</svelte:head>

<div class="max-w-md mx-auto px-4 py-20 sm:py-28 text-center space-y-6">
	{#if form?.resubscribed}
		<div class="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold shadow-xs">
			✓
		</div>
		<h1 class="text-2xl font-bold text-slate-900">
			You're resubscribed!
		</h1>
		<p class="text-xs text-slate-600">
			Your subscription to AI Tathastu Insights has been restored.
		</p>
		<a href="/" class="inline-block text-xs font-semibold text-indigo-600 hover:underline">
			← Back to publication
		</a>
	{:else if data.unsubscribed}
		<div class="w-14 h-14 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center mx-auto text-xl font-bold shadow-xs">
			✓
		</div>
		<h1 class="text-2xl font-bold text-slate-900">
			You have been unsubscribed
		</h1>
		<p class="text-xs text-slate-600 leading-relaxed">
			<strong>{data.email}</strong> will no longer receive newsletter dispatches from AI Tathastu Insights.
		</p>

		<div class="pt-4 border-t border-slate-100 space-y-3">
			<p class="text-[11px] text-slate-400">Did you unsubscribe by accident?</p>
			<form method="POST" action="?/resubscribe" use:enhance>
				<input type="hidden" name="token" value={data.token} />
				<button
					type="submit"
					class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 transition"
				>
					Resubscribe with one click
				</button>
			</form>
		</div>
	{:else}
		<h1 class="text-2xl font-bold text-slate-900">
			Unsubscribe
		</h1>
		<p class="text-xs text-slate-600">
			{data.error}
		</p>
		<a href="/" class="inline-block text-xs font-semibold text-indigo-600 hover:underline">
			Return to Home
		</a>
	{/if}
</div>
