<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	let loading = $state(false);
</script>

<svelte:head>
	<title>Subscribe to Newsletter — AI Tathastu Insights</title>
	<meta name="description" content="Subscribe to AI Tathastu Insights for independent technical updates and newsletter editions." />
	<link rel="canonical" href="https://aitathastu.info/subscribe" />
</svelte:head>

<div class="max-w-xl mx-auto px-4 py-16 sm:py-24">
	<div class="bg-white rounded-2xl border border-[#E2E8F0] p-8 sm:p-12 shadow-sm space-y-6">
		<div class="text-center space-y-2">
			<span class="inline-block px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-widest bg-[#CCFBF1] text-[#0F766E]">
				NEWSLETTER
			</span>
			<h1 class="font-serif text-2xl sm:text-3xl font-semibold text-[#0F172A] tracking-tight">
				Join AI Tathastu Insights
			</h1>
			<p class="text-sm text-[#475569] leading-relaxed">
				Architectural deep-dives, engineering reflections, and ecosystem updates delivered straight to your inbox.
			</p>
		</div>

		{#if form?.success}
			<div class="p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm leading-relaxed" role="alert">
				<p class="font-bold mb-1">Check your inbox</p>
				<p>{form.message}</p>
			</div>
			<div class="text-center">
				<a href="/" class="text-xs font-semibold text-[#0F766E] hover:underline">
					← Return to Home
				</a>
			</div>
		{:else}
			{#if form?.error}
				<div class="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold" role="alert">
					{form.error}
				</div>
			{/if}

			<form
				method="POST"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						loading = false;
						await update();
					};
				}}
				class="space-y-4"
			>
				<!-- Honeypot -->
				<input type="text" name="b_url_honeypot" tabindex="-1" autocomplete="off" class="hidden" />

				<div>
					<label for="email" class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
						Email Address
					</label>
					<input
						type="email"
						id="email"
						name="email"
						required
						placeholder="colleague@organization.com"
						class="w-full h-[48px] rounded-xl border border-[#E2E8F0] px-4 text-sm text-[#0F172A] placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-[#0F766E]"
					/>
				</div>

				<div class="pt-2">
					<button
						type="submit"
						disabled={loading}
						class="w-full h-[48px] rounded-xl bg-[#0F766E] text-white font-semibold text-sm hover:bg-[#115E59] transition shadow-xs disabled:opacity-50"
					>
						{loading ? 'Submitting…' : 'Subscribe to Newsletter'}
					</button>
				</div>
			</form>

			<p class="text-xs text-center text-slate-500">
				We honor your privacy under GDPR. Double opt-in confirmation required. Instant 1-click unsubscribe included in every email.
			</p>
		{/if}
	</div>
</div>
