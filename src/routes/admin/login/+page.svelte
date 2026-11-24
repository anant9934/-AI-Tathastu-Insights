<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();
	let loading = $state(false);
</script>

<svelte:head>
	<title>Sign in — AI Tathastu Insights Admin</title>
</svelte:head>

<div class="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
		<span class="inline-flex items-center justify-center p-3 bg-slate-900 rounded-xl text-white font-bold text-xl mb-4 shadow-sm">
			AI
		</span>
		<h1 class="text-2xl font-bold tracking-tight text-slate-900">
			AI Tathastu Insights
		</h1>
		<p class="mt-2 text-sm text-slate-600">
			Sign in to access the editorial dashboard
		</p>
	</div>

	<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
		<div class="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-10">
			{#if form?.success}
				<div class="rounded-xl bg-emerald-50 border border-emerald-200 p-4 mb-6" role="alert">
					<div class="flex">
						<div class="shrink-0 text-emerald-600">
							<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
								<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
							</svg>
						</div>
						<div class="ml-3">
							<h3 class="text-sm font-semibold text-emerald-800">Check your email</h3>
							<p class="mt-1 text-sm text-emerald-700 leading-relaxed">
								{form.message}
							</p>
						</div>
					</div>
				</div>
				<p class="text-xs text-slate-500 text-center">
					Didn't receive it? Check your spam folder or wait a moment to try again.
				</p>
			{:else}
				{#if form?.error}
					<div class="rounded-xl bg-rose-50 border border-rose-200 p-4 mb-6" role="alert">
						<div class="flex">
							<div class="shrink-0 text-rose-600">
								<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
									<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
								</svg>
							</div>
							<div class="ml-3">
								<p class="text-sm font-medium text-rose-800">{form.error}</p>
							</div>
						</div>
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
					class="space-y-5"
				>
					<div>
						<label for="email" class="block text-sm font-medium text-slate-700">
							Staff email address
						</label>
						<div class="mt-1">
							<input
								id="email"
								name="email"
								type="email"
								autocomplete="email"
								required
								placeholder="name@company.com"
								value={form?.email || ''}
								class="block w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 text-sm transition"
							/>
						</div>
						<p class="mt-2 text-xs text-slate-500">
							We will send you a passwordless single-use sign-in link valid for 15 minutes.
						</p>
					</div>

					<button
						type="submit"
						disabled={loading}
						class="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition disabled:opacity-50"
					>
						{#if loading}
							<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							Sending magic link…
						{:else}
							Send Magic Sign-in Link
						{/if}
					</button>
				</form>
			{/if}
		</div>

		<div class="text-center mt-6">
			<a href="/" class="text-sm font-medium text-slate-600 hover:text-slate-900 transition">
				← Back to publication
			</a>
		</div>
	</div>
</div>
