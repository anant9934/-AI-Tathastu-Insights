<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Audit Log — AI Tathastu Admin</title>
</svelte:head>

<div class="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
	<!-- Top Bar -->
	<div class="pb-6 border-b border-slate-200">
		<h1 class="text-2xl font-bold tracking-tight text-slate-900">
			Security & Audit Log
		</h1>
		<p class="text-xs text-slate-500 mt-1">
			Append-only, immutable record of state-changing operations and authentication events
		</p>
	</div>

	<!-- Audit Table -->
	<div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
		{#if data.logs.length === 0}
			<div class="p-12 text-center text-slate-400 text-xs">
				No audit records logged yet.
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-slate-200 text-left text-xs">
					<thead class="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
						<tr>
							<th class="px-6 py-3.5">Timestamp</th>
							<th class="px-6 py-3.5">Action</th>
							<th class="px-6 py-3.5">Entity</th>
							<th class="px-6 py-3.5">Actor</th>
							<th class="px-6 py-3.5">Client IP</th>
							<th class="px-6 py-3.5">Diff / Payload</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-slate-100 bg-white font-mono text-[11px]">
						{#each data.logs as log}
							<tr class="hover:bg-slate-50 transition">
								<td class="px-6 py-4 whitespace-nowrap text-slate-500">
									{new Date(log.createdAt).toLocaleString()}
								</td>
								<td class="px-6 py-4 whitespace-nowrap font-bold text-slate-900">
									{log.action}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-slate-600">
									{log.entityType} {log.entityId ? `#${log.entityId.slice(0, 8)}` : ''}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-slate-700">
									{log.actor?.name || log.actorId || 'System'}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-slate-400">
									{log.ip || '—'}
								</td>
								<td class="px-6 py-4 text-slate-500 max-w-xs truncate">
									{log.diff ? JSON.stringify(log.diff) : '—'}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>
