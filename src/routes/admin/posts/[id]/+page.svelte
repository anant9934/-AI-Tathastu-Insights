<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import { slugify } from '#lib/utils';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	// Post State
	let title = $state(data.post.title);
	let slug = $state(data.post.slug);
	let isSlugLocked = $state(true);
	let kind = $state(data.post.kind);
	let categoryId = $state(data.post.categoryId || '');
	let coverMediaId = $state(data.post.coverMediaId || '');
	let changelogType = $state(data.post.changelogType || 'new');
	let excerpt = $state(data.post.excerpt || '');
	let contentHtml = $state(data.post.contentHtml || '');
	let seoTitle = $state(data.post.seoTitle || '');
	let seoDescription = $state(data.post.seoDescription || '');
	let scheduledFor = $state(
		data.post.scheduledFor ? new Date(data.post.scheduledFor).toISOString().slice(0, 16) : ''
	);

	// Editor State
	let saveStatus = $state<'saved' | 'saving' | 'unsaved'>('saved');
	let lastSavedTime = $state(new Date(data.post.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
	let isMediaModalOpen = $state(false);
	let isRevisionsOpen = $state(false);
	let editorElement: HTMLDivElement;

	// Update slug when unlocked and title changes
	$effect(() => {
		if (!isSlugLocked) {
			slug = slugify(title);
		}
	});

	function markDirty() {
		saveStatus = 'unsaved';
	}

	function handleFormat(command: string, value: string | undefined = undefined) {
		document.execCommand(command, false, value);
		if (editorElement) {
			contentHtml = editorElement.innerHTML;
			markDirty();
		}
	}

	function insertHeading(tag: 'h2' | 'h3') {
		document.execCommand('formatBlock', false, `<${tag}>`);
		if (editorElement) {
			contentHtml = editorElement.innerHTML;
			markDirty();
		}
	}

	function insertLink() {
		const url = prompt('Enter link URL (https://…):');
		if (url) {
			document.execCommand('createLink', false, url);
			if (editorElement) {
				contentHtml = editorElement.innerHTML;
				markDirty();
			}
		}
	}

	function selectCoverImage(mediaId: string) {
		coverMediaId = mediaId;
		isMediaModalOpen = false;
		markDirty();
	}

	function insertImageIntoEditor(secureUrl: string, altText: string) {
		if (editorElement) {
			editorElement.focus();
			document.execCommand('insertImage', false, secureUrl);
			contentHtml = editorElement.innerHTML;
			isMediaModalOpen = false;
			markDirty();
		}
	}

	// Keyboard Shortcuts: Cmd+S / Ctrl+S to save, Cmd+Enter to publish
	function handleKeydown(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && e.key === 's') {
			e.preventDefault();
			const saveForm = document.getElementById('post-edit-form') as HTMLFormElement;
			if (saveForm) saveForm.requestSubmit();
		}
	}

	// Local Storage Backup every 10s (FR-CMS-04)
	onMount(() => {
		const storageKey = `post_backup_${data.post.id}`;
		const savedLocal = localStorage.getItem(storageKey);
		if (savedLocal) {
			try {
				const parsed = JSON.parse(savedLocal);
				if (new Date(parsed.timestamp).getTime() > new Date(data.post.updatedAt).getTime()) {
					if (confirm(`You have unsaved local edits from ${new Date(parsed.timestamp).toLocaleTimeString()}. Restore them?`)) {
						title = parsed.title || title;
						contentHtml = parsed.contentHtml || contentHtml;
						if (editorElement) editorElement.innerHTML = contentHtml;
					}
				}
			} catch (e) {}
		}

		const interval = setInterval(() => {
			if (saveStatus === 'unsaved') {
				localStorage.setItem(storageKey, JSON.stringify({
					title,
					contentHtml,
					timestamp: new Date().toISOString()
				}));
			}
		}, 10000);

		window.addEventListener('keydown', handleKeydown);

		return () => {
			clearInterval(interval);
			window.removeEventListener('keydown', handleKeydown);
		};
	});

	const selectedCover = $derived(
		data.mediaList.find((m: any) => m.id === coverMediaId) || data.post.coverMedia
	);

	const canPublish = $derived(
		data.currentUser.role === 'editor' || data.currentUser.role === 'owner'
	);
</script>

<svelte:head>
	<title>Edit: {title} — AI Tathastu Admin</title>
</svelte:head>

<div class="min-h-screen bg-slate-50 flex flex-col">
	<!-- Editor Top Sticky Navigation -->
	<header class="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs">
		<div class="flex items-center gap-3">
			<a
				href="/admin/posts"
				class="text-xs font-semibold text-slate-500 hover:text-slate-900 transition flex items-center gap-1"
			>
				← Posts
			</a>
			<span class="text-slate-300">|</span>
			<span class="text-xs font-medium text-slate-500 capitalize">
				{kind}
			</span>
			<span class="text-xs text-slate-400 font-mono truncate max-w-xs">
				/{slug}
			</span>
		</div>

		<!-- Status & Action Buttons -->
		<div class="flex items-center gap-3">
			<!-- Save status indicator -->
			<div class="text-xs text-slate-500 mr-2 flex items-center gap-1.5" aria-live="polite">
				{#if saveStatus === 'saving'}
					<span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
					<span>Saving…</span>
				{:else if saveStatus === 'unsaved'}
					<span class="w-2 h-2 rounded-full bg-amber-400"></span>
					<span class="text-amber-700 font-medium">Unsaved changes</span>
				{:else}
					<span class="w-2 h-2 rounded-full bg-emerald-500"></span>
					<span>Saved {lastSavedTime}</span>
				{/if}
			</div>

			<!-- Revisions button -->
			<button
				type="button"
				onclick={() => isRevisionsOpen = true}
				class="px-3 py-1.5 text-xs font-medium rounded-lg text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
			>
				Revisions ({data.post.revisions.length})
			</button>

			<!-- Preview Button -->
			<a
				href={`/preview/${data.post.id}`}
				target="_blank"
				class="px-3 py-1.5 text-xs font-medium rounded-lg text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 shadow-xs transition"
			>
				Preview ↗
			</a>

			<!-- Save Draft Form Button -->
			<button
				type="submit"
				form="post-edit-form"
				class="px-3.5 py-1.5 text-xs font-semibold rounded-lg text-slate-800 bg-slate-200 hover:bg-slate-300 transition"
			>
				Save Draft (⌘S)
			</button>

			<!-- Publish / Unpublish Actions (Editor / Owner) -->
			{#if canPublish}
				{#if data.post.status === 'published'}
					<form method="POST" action="?/unpublish" use:enhance class="inline">
						<button
							type="submit"
							class="px-3.5 py-1.5 text-xs font-semibold rounded-lg text-amber-700 bg-amber-100 hover:bg-amber-200 transition"
						>
							Unpublish
						</button>
					</form>
				{:else}
					<form
						method="POST"
						action="?/publish"
						use:enhance
						onsubmit={(e) => {
							if (!confirm(`Are you ready to publish "${title}" immediately?`)) e.preventDefault();
						}}
						class="inline"
					>
						<button
							type="submit"
							class="px-4 py-1.5 text-xs font-semibold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition"
						>
							Publish Now
						</button>
					</form>
				{/if}
			{/if}
		</div>
	</header>

	<!-- Main Editor Body -->
	<div class="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
		<!-- Left: Post Content Editor (2 Columns) -->
		<div class="lg:col-span-2 space-y-6">
			<!-- Title Input -->
			<div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
				<textarea
					bind:value={title}
					oninput={markDirty}
					rows="2"
					placeholder="Post title…"
					class="w-full text-2xl sm:text-3xl font-extrabold text-slate-900 placeholder-slate-300 resize-none border-0 focus:outline-hidden focus:ring-0 leading-tight"
				></textarea>

				<!-- Slug Bar -->
				<div class="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
					<span class="font-mono text-slate-400">Slug:</span>
					{#if isSlugLocked}
						<span class="font-mono text-slate-800 font-medium">/{slug}</span>
						<button
							type="button"
							onclick={() => isSlugLocked = false}
							class="text-[11px] text-indigo-600 hover:underline"
						>
							Edit
						</button>
					{:else}
						<div class="flex items-center gap-1 flex-1">
							<span class="text-slate-400">/</span>
							<input
								type="text"
								bind:value={slug}
								oninput={markDirty}
								class="border border-slate-300 rounded px-2 py-0.5 text-xs font-mono w-full max-w-sm text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
							/>
							<button
								type="button"
								onclick={() => isSlugLocked = true}
								class="text-[11px] text-indigo-600 hover:underline"
							>
								Done
							</button>
						</div>
					{/if}
				</div>
			</div>

			<!-- Rich Text Editor Container -->
			<div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
				<!-- Formatting Toolbar -->
				<div class="bg-slate-50 border-b border-slate-200 px-4 py-2 flex flex-wrap items-center gap-1 sticky top-[57px] z-20">
					<button
						type="button"
						onclick={() => handleFormat('bold')}
						title="Bold"
						class="p-1.5 rounded hover:bg-slate-200 font-bold text-xs text-slate-700"
					>
						B
					</button>
					<button
						type="button"
						onclick={() => handleFormat('italic')}
						title="Italic"
						class="p-1.5 rounded hover:bg-slate-200 italic text-xs text-slate-700"
					>
						I
					</button>
					<span class="w-px h-4 bg-slate-300 mx-1"></span>

					<button
						type="button"
						onclick={() => insertHeading('h2')}
						title="Heading 2"
						class="px-2 py-1 rounded hover:bg-slate-200 text-xs font-bold text-slate-700"
					>
						H2
					</button>
					<button
						type="button"
						onclick={() => insertHeading('h3')}
						title="Heading 3"
						class="px-2 py-1 rounded hover:bg-slate-200 text-xs font-bold text-slate-700"
					>
						H3
					</button>
					<span class="w-px h-4 bg-slate-300 mx-1"></span>

					<button
						type="button"
						onclick={() => handleFormat('insertUnorderedList')}
						title="Bullet list"
						class="p-1.5 rounded hover:bg-slate-200 text-xs text-slate-700"
					>
						• List
					</button>
					<button
						type="button"
						onclick={() => handleFormat('insertOrderedList')}
						title="Numbered list"
						class="p-1.5 rounded hover:bg-slate-200 text-xs text-slate-700"
					>
						1. List
					</button>
					<button
						type="button"
						onclick={() => handleFormat('formatBlock', '<blockquote>')}
						title="Quote"
						class="p-1.5 rounded hover:bg-slate-200 text-xs text-slate-700"
					>
						Quote
					</button>
					<span class="w-px h-4 bg-slate-300 mx-1"></span>

					<button
						type="button"
						onclick={insertLink}
						title="Insert Link"
						class="p-1.5 rounded hover:bg-slate-200 text-xs text-slate-700"
					>
						Link
					</button>
					<button
						type="button"
						onclick={() => isMediaModalOpen = true}
						title="Insert Media"
						class="px-2 py-1 rounded hover:bg-slate-200 text-xs font-medium text-slate-700 flex items-center gap-1"
					>
						<span>📷 Media</span>
					</button>
					<button
						type="button"
						onclick={() => handleFormat('insertHorizontalRule')}
						title="Divider"
						class="p-1.5 rounded hover:bg-slate-200 text-xs text-slate-700"
					>
						― Line
					</button>
				</div>

				<!-- Content Editable Canvas (styled like public site) -->
				<div
					bind:this={editorElement}
					contenteditable="true"
					role="textbox"
					aria-multiline="true"
					tabindex="0"
					oninput={() => {
						if (editorElement) contentHtml = editorElement.innerHTML;
						markDirty();
					}}
					class="prose prose-slate max-w-none p-6 sm:p-8 min-h-[450px] focus:outline-hidden text-slate-800 leading-relaxed font-serif text-base"
				>
					{@html contentHtml}
				</div>
			</div>
		</div>

		<!-- Right: Post Settings & Metadata (1 Column) -->
		<div class="space-y-6">
			<!-- Form wrapper for POST -->
			<form
				id="post-edit-form"
				method="POST"
				action="?/save"
				use:enhance={() => {
					saveStatus = 'saving';
					return async ({ result, update }) => {
						if (result.type === 'success') {
							saveStatus = 'saved';
							lastSavedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
						} else {
							saveStatus = 'unsaved';
						}
						await update({ reset: false });
					};
				}}
				class="space-y-6"
			>
				<!-- Hidden values -->
				<input type="hidden" name="title" value={title} />
				<input type="hidden" name="slug" value={slug} />
				<input type="hidden" name="contentHtml" value={contentHtml} />
				<input type="hidden" name="coverMediaId" value={coverMediaId} />

				<!-- Publishing Settings Card -->
				<div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
					<h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider">
						Publishing Config
					</h3>

					<div>
						<label for="select-kind" class="block text-xs font-semibold text-slate-700 mb-1">
							Content Kind
						</label>
						<select
							id="select-kind"
							name="kind"
							bind:value={kind}
							onchange={markDirty}
							class="w-full rounded-xl border border-slate-300 text-xs px-3 py-2 bg-white text-slate-800 focus:ring-1 focus:ring-slate-900"
						>
							<option value="article">Article</option>
							<option value="announcement">Announcement</option>
							<option value="newsletter">Newsletter</option>
							<option value="changelog">Changelog</option>
						</select>
					</div>

					{#if kind === 'changelog'}
						<div>
							<label for="select-changelog" class="block text-xs font-semibold text-slate-700 mb-1">
								Changelog Badge Type
							</label>
							<select
								id="select-changelog"
								name="changelogType"
								bind:value={changelogType}
								onchange={markDirty}
								class="w-full rounded-xl border border-slate-300 text-xs px-3 py-2 bg-white text-slate-800 focus:ring-1 focus:ring-slate-900"
							>
								<option value="new">New (Feature)</option>
								<option value="improved">Improved (Update)</option>
								<option value="fixed">Fixed (Bug fix)</option>
								<option value="breaking">Breaking (Notice)</option>
							</select>
						</div>
					{/if}

					<div>
						<label for="select-category" class="block text-xs font-semibold text-slate-700 mb-1">
							Category
						</label>
						<select
							id="select-category"
							name="categoryId"
							bind:value={categoryId}
							onchange={markDirty}
							class="w-full rounded-xl border border-slate-300 text-xs px-3 py-2 bg-white text-slate-800 focus:ring-1 focus:ring-slate-900"
						>
							<option value="">No category</option>
							{#each data.categories as cat}
								<option value={cat.id}>{cat.name}</option>
							{/each}
						</select>
					</div>

					<div>
						<label for="input-scheduled" class="block text-xs font-semibold text-slate-700 mb-1">
							Schedule Release (optional)
						</label>
						<input
							id="input-scheduled"
							type="datetime-local"
							name="scheduledFor"
							bind:value={scheduledFor}
							onchange={markDirty}
							class="w-full rounded-xl border border-slate-300 text-xs px-3 py-2 text-slate-800 focus:ring-1 focus:ring-slate-900"
						/>
					</div>
				</div>

				<!-- Cover Image Card -->
				<div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
					<div class="flex items-center justify-between">
						<h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider">
							Cover Image
						</h3>
						{#if coverMediaId}
							<button
								type="button"
								onclick={() => { coverMediaId = ''; markDirty(); }}
								class="text-[11px] text-rose-600 hover:underline"
							>
								Remove
							</button>
						{/if}
					</div>

					{#if selectedCover}
						<div class="relative rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-100">
							<img
								src={selectedCover.secureUrl}
								alt={selectedCover.altText || 'Cover'}
								class="w-full h-full object-cover"
							/>
						</div>
					{:else}
						<div class="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
							<p class="text-xs text-slate-400">No cover image selected</p>
						</div>
					{/if}

					<button
						type="button"
						onclick={() => isMediaModalOpen = true}
						class="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
					>
						{selectedCover ? 'Change Cover Media' : 'Select Cover Media'}
					</button>
				</div>

				<!-- Excerpt Card -->
				<div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
					<div class="flex items-center justify-between">
						<label for="textarea-excerpt" class="text-xs font-bold text-slate-900 uppercase tracking-wider">
							Excerpt / Dek
						</label>
						<span class={`text-[11px] ${excerpt.length > 160 ? 'text-amber-600 font-semibold' : 'text-slate-400'}`}>
							{excerpt.length}/160
						</span>
					</div>
					<textarea
						id="textarea-excerpt"
						name="excerpt"
						bind:value={excerpt}
						oninput={markDirty}
						rows="3"
						placeholder="Brief summary used in card grids and social shares…"
						class="w-full rounded-xl border border-slate-300 text-xs p-3 text-slate-800 placeholder-slate-400 focus:ring-1 focus:ring-slate-900"
					></textarea>
				</div>

				<!-- SEO Metadata Card -->
				<div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
					<h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider">
						Search & Social SEO
					</h3>

					<div>
						<label for="input-seotitle" class="block text-xs font-semibold text-slate-700 mb-1">
							Meta Title
						</label>
						<input
							id="input-seotitle"
							type="text"
							name="seoTitle"
							bind:value={seoTitle}
							oninput={markDirty}
							placeholder={title}
							class="w-full rounded-xl border border-slate-300 text-xs px-3 py-2 text-slate-800 placeholder-slate-400 focus:ring-1 focus:ring-slate-900"
						/>
					</div>

					<div>
						<label for="input-seodesc" class="block text-xs font-semibold text-slate-700 mb-1">
							Meta Description
						</label>
						<textarea
							id="input-seodesc"
							name="seoDescription"
							bind:value={seoDescription}
							oninput={markDirty}
							rows="2"
							placeholder={excerpt || 'Description for search engines…'}
							class="w-full rounded-xl border border-slate-300 text-xs p-3 text-slate-800 placeholder-slate-400 focus:ring-1 focus:ring-slate-900"
						></textarea>
					</div>
				</div>
			</form>
		</div>
	</div>
</div>

<!-- Media Picker Modal -->
{#if isMediaModalOpen}
	<div class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
		<div class="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col">
			<div class="flex items-center justify-between pb-4 border-b border-slate-200">
				<div>
					<h3 class="text-base font-bold text-slate-900">Media Library</h3>
					<p class="text-xs text-slate-500">Choose an image for cover or content insertion</p>
				</div>
				<button
					type="button"
					onclick={() => isMediaModalOpen = false}
					class="text-slate-400 hover:text-slate-600 text-lg"
				>
					✕
				</button>
			</div>

			<div class="flex-1 overflow-y-auto py-4">
				{#if data.mediaList.length === 0}
					<div class="text-center py-12 text-slate-500">
						<p class="text-sm">No media uploaded yet.</p>
						<a href="/admin/media" target="_blank" class="text-xs text-indigo-600 hover:underline mt-1 inline-block">
							Go to Media Library to upload assets ↗
						</a>
					</div>
				{:else}
					<div class="grid grid-cols-3 sm:grid-cols-4 gap-3">
						{#each data.mediaList as item}
							<div class="group relative rounded-xl overflow-hidden border border-slate-200 aspect-square bg-slate-100 flex flex-col justify-end">
								<img
									src={item.secureUrl}
									alt={item.altText || ''}
									class="absolute inset-0 w-full h-full object-cover"
								/>
								<div class="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2 p-2">
									<button
										type="button"
										onclick={() => selectCoverImage(item.id)}
										class="w-full py-1 px-2 rounded-lg bg-white text-slate-900 text-[10px] font-bold shadow-xs hover:bg-slate-100"
									>
										Use as Cover
									</button>
									<button
										type="button"
										onclick={() => insertImageIntoEditor(item.secureUrl, item.altText)}
										class="w-full py-1 px-2 rounded-lg bg-indigo-600 text-white text-[10px] font-bold shadow-xs hover:bg-indigo-700"
									>
										Insert in Body
									</button>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>

			<div class="pt-4 border-t border-slate-200 flex justify-between items-center text-xs">
				<a href="/admin/media" target="_blank" class="text-indigo-600 hover:underline">
					Upload new asset in Media Manager ↗
				</a>
				<button
					type="button"
					onclick={() => isMediaModalOpen = false}
					class="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
				>
					Close
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- Revisions Drawer Modal -->
{#if isRevisionsOpen}
	<div class="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex justify-end">
		<div class="bg-white w-full max-w-md h-full shadow-2xl border-l border-slate-200 p-6 flex flex-col">
			<div class="flex items-center justify-between pb-4 border-b border-slate-200">
				<div>
					<h3 class="text-base font-bold text-slate-900">Revision History</h3>
					<p class="text-xs text-slate-500">Last 20 immutable snapshots</p>
				</div>
				<button
					type="button"
					onclick={() => isRevisionsOpen = false}
					class="text-slate-400 hover:text-slate-600 text-lg"
				>
					✕
				</button>
			</div>

			<div class="flex-1 overflow-y-auto py-4 space-y-3">
				{#each data.post.revisions as rev}
					<div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
						<div class="flex items-center justify-between">
							<span class="font-bold text-slate-900">
								{new Date(rev.createdAt).toLocaleString()}
							</span>
							{#if rev.snapshot?.status === 'published'}
								<span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
									Published
								</span>
							{/if}
						</div>
						<p class="text-slate-600 mt-1 line-clamp-1 font-medium">
							Title: {rev.snapshot?.title || 'Untitled'}
						</p>
					</div>
				{/each}
			</div>

			<button
				type="button"
				onclick={() => isRevisionsOpen = false}
				class="w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs"
			>
				Close Revisions
			</button>
		</div>
	</div>
{/if}
