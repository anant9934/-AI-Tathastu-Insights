<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let siteName = $state(data.config.site_name || 'AI Tathastu Insights');
	let siteDescription = $state(data.config.site_description || 'Company news, newsletters, and ecosystem updates.');
	let contactEmail = $state(data.config.contact_email || 'info.aitathastu@gmail.com');
	let archivedStatus = $state(data.config.archived_post_status || '404');
	let defaultOgImage = $state(data.config.default_og_image || '');
</script>

<svelte:head>
	<title>Settings — AI Tathastu Admin</title>
</svelte:head>

<div class="p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
	<!-- Top Bar -->
	<div class="pb-6 border-b border-slate-200">
		<h1 class="text-2xl font-bold tracking-tight text-slate-900">
			Platform Settings
		</h1>
		<p class="text-xs text-slate-500 mt-1">
			Site metadata, contact info, and canonical delivery preferences
		</p>
	</div>

	{#if form?.success}
		<div class="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
			Settings saved successfully!
		</div>
	{/if}

	<form method="POST" use:enhance class="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
		<div>
			<label for="input-sitename" class="block text-xs font-bold text-slate-700 mb-1">
				Publication Name *
			</label>
			<input
				id="input-sitename"
				type="text"
				name="site_name"
				bind:value={siteName}
				required
				class="w-full rounded-xl border border-slate-300 text-xs px-3 py-2 text-slate-900 focus:ring-1 focus:ring-slate-900"
			/>
		</div>

		<div>
			<label for="input-sitedesc" class="block text-xs font-bold text-slate-700 mb-1">
				Default Meta Description *
			</label>
			<textarea
				id="input-sitedesc"
				name="site_description"
				bind:value={siteDescription}
				rows="3"
				required
				class="w-full rounded-xl border border-slate-300 text-xs p-3 text-slate-900 focus:ring-1 focus:ring-slate-900"
			></textarea>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<div>
				<label for="input-contactemail" class="block text-xs font-bold text-slate-700 mb-1">
					Editorial Contact Email *
				</label>
				<input
					id="input-contactemail"
					type="email"
					name="contact_email"
					bind:value={contactEmail}
					required
					class="w-full rounded-xl border border-slate-300 text-xs px-3 py-2 text-slate-900 focus:ring-1 focus:ring-slate-900"
				/>
			</div>

			<div>
				<label for="input-archivedstatus" class="block text-xs font-bold text-slate-700 mb-1">
					Archived Post HTTP Status (FR-CMS-10.1)
				</label>
				<select
					id="input-archivedstatus"
					name="archived_post_status"
					bind:value={archivedStatus}
					class="w-full rounded-xl border border-slate-300 text-xs px-3 py-2 bg-white text-slate-900 focus:ring-1 focus:ring-slate-900"
				>
					<option value="404">404 Not Found (Standard)</option>
					<option value="410">410 Gone (Explicitly indicates permanent archival)</option>
				</select>
			</div>
		</div>

		<div>
			<label for="input-ogimage" class="block text-xs font-bold text-slate-700 mb-1">
				Default OpenGraph Fallback Image URL
			</label>
			<input
				id="input-ogimage"
				type="url"
				name="default_og_image"
				bind:value={defaultOgImage}
				placeholder="https://res.cloudinary.com/…"
				class="w-full rounded-xl border border-slate-300 text-xs px-3 py-2 text-slate-900 focus:ring-1 focus:ring-slate-900"
			/>
		</div>

		<div class="pt-4 border-t border-slate-200 flex justify-end">
			<button
				type="submit"
				class="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition shadow-xs"
			>
				Save Changes
			</button>
		</div>
	</form>
</div>
