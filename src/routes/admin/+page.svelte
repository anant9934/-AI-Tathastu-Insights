<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function getStatusBadgeClass(status: string) {
		switch (status) {
			case 'published':
				return 'bg-emerald-50 text-emerald-700 border-emerald-200';
			case 'draft':
				return 'bg-amber-50 text-amber-700 border-amber-200';
			case 'scheduled':
				return 'bg-blue-50 text-blue-700 border-blue-200';
			case 'archived':
				return 'bg-slate-100 text-slate-600 border-slate-200';
			default:
				return 'bg-slate-50 text-slate-700 border-slate-200';
		}
	}

	function formatDate(d: Date | string | null | undefined) {
		if (!d) return '—';
		return new Date(d).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function formatDateTime(d: Date | string | null | undefined) {
		if (!d) return '—';
		return new Date(d).toLocaleString('en-US', {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<svelte:head>
	<title>Dashboard — AI Tathastu Admin</title>
</svelte:head>

<div class="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
	<!-- Top Bar / Welcome -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-slate-900">
				Dashboard
			</h1>
			<p class="text-xs text-slate-500 mt-1">
				AI Tathastu Insights publication overview & content pipeline
			</p>
		</div>
		<div class="flex items-center gap-3">
			<a
				href="/admin/media"
				class="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 shadow-sm transition"
			>
				Upload Media
			</a>
			<a
				href="/admin/posts/new"
				class="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition"
			>
				+ Create Post
			</a>
		</div>
	</div>

	<!-- Metric Cards Grid -->
	<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
		<div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
			<span class="text-xs font-medium text-slate-500 uppercase tracking-wider">Published</span>
			<div class="mt-2 flex items-baseline justify-between">
				<span class="text-3xl font-extrabold text-slate-900">{data.counts.published}</span>
				<span class="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Live</span>
			</div>
		</div>

		<div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
			<span class="text-xs font-medium text-slate-500 uppercase tracking-wider">Drafts</span>
			<div class="mt-2 flex items-baseline justify-between">
				<span class="text-3xl font-extrabold text-slate-900">{data.counts.draft}</span>
				<span class="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">In progress</span>
			</div>
		</div>

		<div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
			<span class="text-xs font-medium text-slate-500 uppercase tracking-wider">Scheduled</span>
			<div class="mt-2 flex items-baseline justify-between">
				<span class="text-3xl font-extrabold text-slate-900">{data.counts.scheduled}</span>
				<span class="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Upcoming</span>
			</div>
		</div>

		<div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
			<span class="text-xs font-medium text-slate-500 uppercase tracking-wider">Subscribers</span>
			<div class="mt-2 flex items-baseline justify-between">
				<span class="text-3xl font-extrabold text-slate-900">{data.subscriberCounts.confirmed}</span>
				<span class="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
					+{data.subscriberCounts.pending} pending
				</span>
			</div>
		</div>
	</div>

	<!-- Main Content Columns -->
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
		<!-- Left: Recent Posts Table (2 Cols) -->
		<div class="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
			<div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
				<h2 class="text-sm font-bold text-slate-900">Recently Updated Posts</h2>
				<a href="/admin/posts" class="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition">
					View all posts →
				</a>
			</div>

			<div class="divide-y divide-slate-100">
				{#if data.recentPosts.length === 0}
					<div class="p-8 text-center text-slate-500">
						<p class="text-sm">No posts created yet.</p>
						<a href="/admin/posts/new" class="mt-2 inline-block text-xs font-medium text-indigo-600 hover:underline">
							Create your first post
						</a>
					</div>
				{:else}
					{#each data.recentPosts as post}
						<div class="p-4 hover:bg-slate-50 transition flex items-center justify-between gap-4">
							<div class="min-w-0 flex-1">
								<div class="flex items-center gap-2 mb-1">
									<span class={`inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md border ${getStatusBadgeClass(post.status)}`}>
										{post.status}
									</span>
									<span class="text-[11px] text-slate-400 capitalize">
										{post.kind}
									</span>
									{#if post.category}
										<span class="text-[11px] text-slate-400">• {post.category.name}</span>
									{/if}
								</div>
								<a
									href={`/admin/posts/${post.id}`}
									class="text-sm font-semibold text-slate-900 hover:text-indigo-600 transition truncate block"
								>
									{post.title}
								</a>
								<div class="mt-1 flex items-center gap-2 text-xs text-slate-500">
									<span>by {post.author.name}</span>
									<span>•</span>
									<span>Updated {formatDate(post.updatedAt)}</span>
								</div>
							</div>

							<div class="flex items-center gap-2 shrink-0">
								<a
									href={`/admin/posts/${post.id}`}
									class="px-3 py-1.5 text-xs font-medium rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
								>
									Edit
								</a>
							</div>
						</div>
					{/each}
				{/if}
			</div>
		</div>

		<!-- Right: Scheduled Pipeline & Quick Stats (1 Col) -->
		<div class="space-y-6">
			<!-- Scheduled Posts -->
			<div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
				<h2 class="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
					<span>Scheduled Publishing</span>
					<span class="w-2 h-2 rounded-full bg-blue-500"></span>
				</h2>

				{#if data.scheduledPosts.length === 0}
					<p class="text-xs text-slate-500 py-3">No posts currently scheduled for release.</p>
				{:else}
					<div class="space-y-3">
						{#each data.scheduledPosts as scheduled}
							<div class="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
								<a
									href={`/admin/posts/${scheduled.id}`}
									class="text-xs font-semibold text-slate-900 hover:text-blue-700 block truncate"
								>
									{scheduled.title}
								</a>
								<p class="text-[11px] text-blue-800 font-medium mt-1">
									⏱ {formatDateTime(scheduled.scheduledFor)}
								</p>
							</div>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Recent Audit Activity (Owner only) -->
			{#if data.recentAuditLogs && data.recentAuditLogs.length > 0}
				<div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
					<div class="flex items-center justify-between mb-3">
						<h2 class="text-sm font-bold text-slate-900">Recent Audit Log</h2>
						<a href="/admin/audit" class="text-xs font-medium text-indigo-600 hover:underline">
							All →
						</a>
					</div>
					<div class="space-y-2.5">
						{#each data.recentAuditLogs as log}
							<div class="text-xs border-b border-slate-100 pb-2 last:border-0 last:pb-0">
								<div class="flex items-center justify-between">
									<span class="font-semibold text-slate-800 font-mono text-[11px]">{log.action}</span>
									<span class="text-[10px] text-slate-400">{formatDateTime(log.createdAt)}</span>
								</div>
								<p class="text-[11px] text-slate-500 mt-0.5">
									{log.entityType} {log.entityId ? `#${log.entityId.slice(0, 8)}` : ''}
								</p>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
