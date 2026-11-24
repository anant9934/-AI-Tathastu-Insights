<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';

	let { data }: { data: PageData } = $props();
	let isNewModalOpen = $state(false);
	let newPostTitle = $state('');
	let newPostKind = $state('article');

	function getStatusBadge(status: string) {
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

	function formatDate(d: any) {
		if (!d) return '—';
		return new Date(d).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function canEdit(postAuthorId: string) {
		if (data.currentUser.role === 'owner' || data.currentUser.role === 'editor') return true;
		if (data.currentUser.role === 'author' && data.currentUser.id === postAuthorId) return true;
		return false;
	}
</script>

<svelte:head>
	<title>Posts — AI Tathastu Admin</title>
</svelte:head>

<div class="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
	<!-- Top Bar -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-slate-900">
				Posts
			</h1>
			<p class="text-xs text-slate-500 mt-1">
				Manage articles, announcements, newsletters, and changelog updates
			</p>
		</div>

		{#if data.currentUser.role !== 'viewer'}
			<button
				type="button"
				onclick={() => isNewModalOpen = true}
				class="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition"
			>
				+ New Post
			</button>
		{/if}
	</div>

	<!-- Filters & Search Toolbar -->
	<div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
		<!-- Status Filters -->
		<div class="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto text-xs">
			{#each [
				{ id: 'all', label: 'All' },
				{ id: 'published', label: 'Published' },
				{ id: 'draft', label: 'Drafts' },
				{ id: 'scheduled', label: 'Scheduled' },
				{ id: 'archived', label: 'Archived' },
				{ id: 'deleted', label: 'Trash' }
			] as tab}
				<a
					href={`/admin/posts?status=${tab.id}&kind=${data.kindFilter}${data.search ? `&q=${encodeURIComponent(data.search)}` : ''}`}
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

		<!-- Kind & Search Form -->
		<form method="GET" class="flex items-center gap-3 w-full md:w-auto">
			<input type="hidden" name="status" value={data.statusFilter} />

			<select
				name="kind"
				onchange={(e) => (e.target as HTMLSelectElement).form?.submit()}
				class="rounded-xl border border-slate-300 text-xs px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900"
			>
				<option value="all" selected={data.kindFilter === 'all'}>All Kinds</option>
				<option value="article" selected={data.kindFilter === 'article'}>Article</option>
				<option value="announcement" selected={data.kindFilter === 'announcement'}>Announcement</option>
				<option value="newsletter" selected={data.kindFilter === 'newsletter'}>Newsletter</option>
				<option value="changelog" selected={data.kindFilter === 'changelog'}>Changelog</option>
			</select>

			<div class="relative flex-1 md:w-64">
				<input
					type="text"
					name="q"
					placeholder="Search by title…"
					value={data.search}
					class="w-full rounded-xl border border-slate-300 text-xs px-3 py-2 pl-8 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900"
				/>
				<svg class="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
			</div>
		</form>
	</div>

	<!-- Posts Table -->
	<div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
		{#if data.posts.length === 0}
			<div class="p-12 text-center text-slate-500">
				<p class="text-sm font-medium">No posts found</p>
				<p class="text-xs text-slate-400 mt-1">Try adjusting your filters or search query.</p>
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-slate-200 text-left text-xs">
					<thead class="bg-slate-50/75 text-slate-500 font-semibold uppercase tracking-wider">
						<tr>
							<th scope="col" class="px-6 py-3.5">Title & Kind</th>
							<th scope="col" class="px-6 py-3.5">Status</th>
							<th scope="col" class="px-6 py-3.5">Category</th>
							<th scope="col" class="px-6 py-3.5">Author</th>
							<th scope="col" class="px-6 py-3.5">Updated</th>
							<th scope="col" class="px-6 py-3.5 text-right">Actions</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-slate-100 bg-white">
						{#each data.posts as post}
							<tr class="hover:bg-slate-50/80 transition">
								<td class="px-6 py-4">
									<div class="flex items-center gap-2 mb-1">
										<span class="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-600">
											{post.kind}
										</span>
										<span class="text-[11px] text-slate-400 font-mono">
											/{post.slug}
										</span>
									</div>
									<a
										href={`/admin/posts/${post.id}`}
										class="text-sm font-bold text-slate-900 hover:text-indigo-600 transition block truncate max-w-md"
									>
										{post.title}
									</a>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<span class={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${getStatusBadge(post.status)}`}>
										{post.status}
									</span>
									{#if post.status === 'scheduled' && post.scheduledFor}
										<p class="text-[10px] text-blue-600 mt-0.5">
											{formatDate(post.scheduledFor)}
										</p>
									{/if}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-slate-600">
									{post.category?.name || '—'}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-slate-600">
									{post.author.name}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-slate-500">
									{formatDate(post.updatedAt)}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-right space-x-2">
									{#if canEdit(post.author.id)}
										<a
											href={`/admin/posts/${post.id}`}
											class="inline-block text-xs font-semibold text-indigo-600 hover:text-indigo-800"
										>
											Edit
										</a>
									{/if}

									{#if post.deletedAt}
										{#if data.currentUser.role === 'owner'}
											<form method="POST" action="?/restore" use:enhance class="inline">
												<input type="hidden" name="id" value={post.id} />
												<button type="submit" class="text-xs font-semibold text-emerald-600 hover:underline">
													Restore
												</button>
											</form>
											<form
												method="POST"
												action="?/hardDelete"
												use:enhance
												onsubmit={(e) => {
													if (!confirm(`Are you sure you want to permanently delete "${post.title}"?`)) e.preventDefault();
												}}
												class="inline"
											>
												<input type="hidden" name="id" value={post.id} />
												<button type="submit" class="text-xs font-semibold text-rose-600 hover:underline">
													Purge
												</button>
											</form>
										{/if}
									{:else}
										{#if data.currentUser.role === 'owner' || data.currentUser.role === 'editor'}
											<form
												method="POST"
												action="?/softDelete"
												use:enhance
												onsubmit={(e) => {
													if (!confirm(`Move "${post.title}" to trash?`)) e.preventDefault();
												}}
												class="inline"
											>
												<input type="hidden" name="id" value={post.id} />
												<button type="submit" class="text-xs text-slate-400 hover:text-rose-600">
													Delete
												</button>
											</form>
										{/if}
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

<!-- Create Post Modal -->
{#if isNewModalOpen}
	<div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
		<div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
			<h2 class="text-lg font-bold text-slate-900 mb-1">Create New Post</h2>
			<p class="text-xs text-slate-500 mb-5">Enter a working title to initialize your draft.</p>

			<form method="POST" action="?/create" use:enhance class="space-y-4">
				<div>
					<label for="post-title" class="block text-xs font-semibold text-slate-700 mb-1">
						Post Title *
					</label>
					<input
						id="post-title"
						type="text"
						name="title"
						bind:value={newPostTitle}
						placeholder="e.g. Announcing AI Tathastu 2.0"
						required
						class="w-full rounded-xl border border-slate-300 text-sm px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900"
					/>
				</div>

				<div>
					<label for="post-kind" class="block text-xs font-semibold text-slate-700 mb-1">
						Content Kind
					</label>
					<select
						id="post-kind"
						name="kind"
						bind:value={newPostKind}
						class="w-full rounded-xl border border-slate-300 text-xs px-3.5 py-2.5 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
					>
						<option value="article">Article (In-depth thought piece or guide)</option>
						<option value="announcement">Announcement (Company news, press release)</option>
						<option value="newsletter">Newsletter (Issue / edition)</option>
						<option value="changelog">Changelog (Product release notes)</option>
					</select>
				</div>

				<div class="flex items-center justify-end gap-3 pt-3">
					<button
						type="button"
						onclick={() => isNewModalOpen = false}
						class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
					>
						Cancel
					</button>
					<button
						type="submit"
						class="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition"
					>
						Create Draft →
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
