<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';

	let { data }: { data: PageData } = $props();

	function getStatusClass(status: string) {
		switch (status) {
			case 'confirmed':
				return 'bg-emerald-50 text-emerald-700 border-emerald-200';
			case 'pending':
				return 'bg-amber-50 text-amber-700 border-amber-200';
			case 'unsubscribed':
				return 'bg-slate-100 text-slate-600 border-slate-200';
			case 'bounced':
				return 'bg-rose-50 text-rose-700 border-rose-200';
			default:
				return 'bg-slate-50 text-slate-700 border-slate-200';
		}
	}
</script>

<svelte:head>
	<title>Subscribers — AI Tathastu Admin</title>
</svelte:head>

<div class="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-slate-900">
				Newsletter Subscribers
			</h1>
			<p class="text-xs text-slate-500 mt-1">
				Consent-based double opt-in subscriptions with one-click ESP export
			</p>
		</div>

		<div class="flex items-center gap-3">
			<a
				href={`/admin/subscribers/export?status=${data.statusFilter}`}
				class="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold text-slate-900 bg-white border border-slate-300 hover:bg-slate-50 shadow-xs transition"
			>
				Export Filtered CSV (ESP) ↓
			</a>
		</div>
	</div>

	<!-- Status Tabs -->
	<div class="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2 overflow-x-auto text-xs">
		{#each [
			{ id: 'all', label: `All (${data.counts.total})` },
			{ id: 'confirmed', label: `Confirmed (${data.counts.confirmed})` },
			{ id: 'pending', label: `Pending (${data.counts.pending})` },
			{ id: 'unsubscribed', label: `Unsubscribed (${data.counts.unsubscribed})` }
		] as tab}
			<a
				href={`/admin/subscribers?status=${tab.id}`}
				class={`px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap ${
					data.statusFilter === tab.id
						? 'bg-slate-900 text-white'
						: 'text-slate-600 hover:bg-slate-100'
				}`}
			>
				{tab.label}
			</a>
		{/each}
	</div>

	<!-- Subscribers Table -->
	<div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
		{#if data.subscribers.length === 0}
			<div class="p-12 text-center text-slate-400 text-xs">
				No subscribers found in this view.
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-slate-200 text-left text-xs">
					<thead class="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
						<tr>
							<th class="px-6 py-3.5">Email</th>
							<th class="px-6 py-3.5">Status</th>
							<th class="px-6 py-3.5">Source</th>
							<th class="px-6 py-3.5">Confirmed At</th>
							<th class="px-6 py-3.5">Joined</th>
							<th class="px-6 py-3.5 text-right">Actions</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-slate-100 bg-white">
						{#each data.subscribers as sub}
							<tr class="hover:bg-slate-50 transition">
								<td class="px-6 py-4 font-semibold text-slate-900">
									{sub.email}
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<span class={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${getStatusClass(sub.status)}`}>
										{sub.status}
									</span>
								</td>
								<td class="px-6 py-4 text-slate-600">
									{sub.source}
								</td>
								<td class="px-6 py-4 text-slate-500">
									{sub.confirmedAt ? new Date(sub.confirmedAt).toLocaleDateString() : '—'}
								</td>
								<td class="px-6 py-4 text-slate-500">
									{new Date(sub.createdAt).toLocaleDateString()}
								</td>
								<td class="px-6 py-4 text-right">
									{#if data.currentUser.role === 'owner'}
										<form
											method="POST"
											action="?/delete"
											use:enhance
											onsubmit={(e) => {
												if (!confirm(`Permanently remove subscriber ${sub.email} (GDPR erasure)?`)) e.preventDefault();
											}}
											class="inline"
										>
											<input type="hidden" name="id" value={sub.id} />
											<button type="submit" class="text-rose-600 hover:underline font-semibold">
												Delete
											</button>
										</form>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>
