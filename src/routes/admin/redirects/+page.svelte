<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';

	let { data }: { data: PageData } = $props();

	let fromPath = $state('');
	let toPath = $state('');
</script>

<svelte:head>
	<title>Redirects — AI Tathastu Admin</title>
</svelte:head>

<div class="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
	<!-- Top Bar -->
	<div class="pb-6 border-b border-slate-200">
		<h1 class="text-2xl font-bold tracking-tight text-slate-900">
			Redirect Manager
		</h1>
		<p class="text-xs text-slate-500 mt-1">
			Permanent 301 URL redirects (flattened single-hop, loop-safe)
		</p>
	</div>

	<!-- Add Redirect Card -->
	<div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
		<h2 class="text-sm font-bold text-slate-900 mb-4">Add 301 Redirect</h2>
		<form method="POST" action="?/create" use:enhance class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
			<div>
				<label for="input-frompath" class="block text-xs font-semibold text-slate-700 mb-1">
					Source Path (e.g. /old-article) *
				</label>
				<input
					id="input-frompath"
					type="text"
					name="fromPath"
					bind:value={fromPath}
					required
					placeholder="/news/old-slug"
					class="w-full rounded-xl border border-slate-300 text-xs px-3 py-2 text-slate-900 focus:ring-1 focus:ring-slate-900"
				/>
			</div>

			<div>
				<label for="input-topath" class="block text-xs font-semibold text-slate-700 mb-1">
					Destination Path (e.g. /news/new-slug) *
				</label>
				<input
					id="input-topath"
					type="text"
					name="toPath"
					bind:value={toPath}
					required
					placeholder="/news/new-slug"
					class="w-full rounded-xl border border-slate-300 text-xs px-3 py-2 text-slate-900 focus:ring-1 focus:ring-slate-900"
				/>
			</div>

			<div>
				<button
					type="submit"
					class="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition shadow-xs"
				>
					Save Redirect →
				</button>
			</div>
		</form>
	</div>

	<!-- Redirects Table -->
	<div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
		{#if data.redirects.length === 0}
			<div class="p-12 text-center text-slate-400 text-xs">
				No redirects configured yet.
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-slate-200 text-left text-xs">
					<thead class="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
						<tr>
							<th class="px-6 py-3.5">Source Path</th>
							<th class="px-6 py-3.5">Destination</th>
							<th class="px-6 py-3.5">HTTP Status</th>
							<th class="px-6 py-3.5">Created</th>
							<th class="px-6 py-3.5 text-right">Action</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-slate-100 bg-white">
						{#each data.redirects as r}
							<tr class="hover:bg-slate-50 transition">
								<td class="px-6 py-4 font-mono font-semibold text-slate-800">
									{r.fromPath}
								</td>
								<td class="px-6 py-4 font-mono text-indigo-600">
									→ {r.toPath}
								</td>
								<td class="px-6 py-4">
									<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
										{r.status}
									</span>
								</td>
								<td class="px-6 py-4 text-slate-500">
									{new Date(r.createdAt).toLocaleDateString()}
								</td>
								<td class="px-6 py-4 text-right">
									<form method="POST" action="?/delete" use:enhance class="inline">
										<input type="hidden" name="fromPath" value={r.fromPath} />
										<button type="submit" class="text-rose-600 hover:underline font-semibold">
											Remove
										</button>
									</form>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>
