<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';

	let { data }: { data: PageData } = $props();

	let uploadFile = $state<File | null>(null);
	let altText = $state('');
	let isDecorative = $state(false);
	let isUploading = $state(false);
	let uploadError = $state('');
	let uploadSuccess = $state('');
	let selectedAsset = $state<any>(null);

	function formatBytes(bytes: number) {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
	}

	async function handleDirectUpload() {
		if (!uploadFile) {
			uploadError = 'Please select a file to upload.';
			return;
		}

		if (!isDecorative && !altText.trim()) {
			uploadError = 'Alt text is mandatory unless marked decorative (WCAG AA).';
			return;
		}

		if (uploadFile.size > 5 * 1024 * 1024) {
			uploadError = `File is ${(uploadFile.size / (1024 * 1024)).toFixed(1)} MB. Maximum allowed is 5 MB.`;
			return;
		}

		isUploading = true;
		uploadError = '';
		uploadSuccess = '';

		try {
			// Step 1: Request signed upload params
			const signRes = await fetch('/api/media/sign', { method: 'POST' });
			if (!signRes.ok) throw new Error('Could not get upload signature');
			const signData = await signRes.json();

			// Step 2: Upload DIRECTLY to Cloudinary (does not transit our app server)
			const formData = new FormData();
			formData.append('file', uploadFile);
			formData.append('api_key', signData.apiKey);
			formData.append('timestamp', signData.timestamp.toString());
			formData.append('signature', signData.signature);
			formData.append('folder', signData.folder);

			const cloudUrl = `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`;
			const cloudRes = await fetch(cloudUrl, {
				method: 'POST',
				body: formData
			});

			if (!cloudRes.ok) {
				const errBody = await cloudRes.json();
				throw new Error(errBody.error?.message || 'Cloudinary upload failed');
			}

			const cloudData = await cloudRes.json();

			// Step 3: Commit asset to database
			const commitRes = await fetch('/api/media/commit', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					publicId: cloudData.public_id,
					altText: altText.trim(),
					decorative: isDecorative
				})
			});

			if (!commitRes.ok) {
				const errBody = await commitRes.json();
				throw new Error(errBody.message || 'Failed to commit asset');
			}

			uploadSuccess = 'Asset uploaded and verified successfully!';
			uploadFile = null;
			altText = '';
			isDecorative = false;

			// Refresh page
			window.location.reload();
		} catch (err: any) {
			uploadError = err.message || 'Upload failed';
		} finally {
			isUploading = false;
		}
	}
</script>

<svelte:head>
	<title>Media Library — AI Tathastu Admin</title>
</svelte:head>

<div class="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
	<!-- Top Bar -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-slate-900">
				Media Library
			</h1>
			<p class="text-xs text-slate-500 mt-1">
				Direct signed uploads to Cloudinary with mandatory alt text & automatic variants
			</p>
		</div>
	</div>

	<!-- Signed Upload Box -->
	<div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
		<h2 class="text-sm font-bold text-slate-900 mb-4">Upload New Media Asset</h2>

		{#if uploadError}
			<div class="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
				{uploadError}
			</div>
		{/if}

		{#if uploadSuccess}
			<div class="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700">
				{uploadSuccess}
			</div>
		{/if}

		<div class="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
			<div>
				<label for="file-input" class="block text-xs font-semibold text-slate-700 mb-1">
					Select image (Max 5 MB) *
				</label>
				<input
					id="file-input"
					type="file"
					accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml,application/pdf"
					onchange={(e) => {
						const input = e.target as HTMLInputElement;
						if (input.files?.[0]) uploadFile = input.files[0];
					}}
					class="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
				/>
			</div>

			<div>
				<div class="flex items-center justify-between mb-1">
					<label for="alt-text-input" class="text-xs font-semibold text-slate-700">
						Alt Text (1-250 chars) *
					</label>
					<label class="flex items-center gap-1 text-[11px] text-slate-500 cursor-pointer">
						<input type="checkbox" bind:checked={isDecorative} class="rounded text-indigo-600 focus:ring-0" />
						Decorative
					</label>
				</div>
				<input
					id="alt-text-input"
					type="text"
					bind:value={altText}
					disabled={isDecorative}
					placeholder={isDecorative ? 'Marked decorative (alt="")' : 'Describe visual for screen readers…'}
					class="w-full rounded-xl border border-slate-300 text-xs px-3 py-2 text-slate-900 placeholder-slate-400 focus:ring-1 focus:ring-slate-900 disabled:bg-slate-50 disabled:text-slate-400"
				/>
			</div>

			<div>
				<button
					type="button"
					onclick={handleDirectUpload}
					disabled={isUploading || !uploadFile}
					class="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 transition shadow-xs flex items-center justify-center gap-2"
				>
					{#if isUploading}
						<svg class="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						Signing & Uploading…
					{:else}
						Upload to Cloudinary →
					{/if}
				</button>
			</div>
		</div>
	</div>

	<!-- Media Grid -->
	<div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
		<h2 class="text-sm font-bold text-slate-900 mb-4">
			Uploaded Assets ({data.mediaList.length})
		</h2>

		{#if data.mediaList.length === 0}
			<div class="text-center py-16 text-slate-400 text-xs">
				No media items found. Use the uploader above to add your first asset.
			</div>
		{:else}
			<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
				{#each data.mediaList as item}
					<button
						type="button"
						onclick={() => selectedAsset = item}
						class="text-left group relative rounded-xl overflow-hidden border border-slate-200 aspect-square bg-slate-100 hover:ring-2 hover:ring-indigo-600 transition"
					>
						<img
							src={item.secureUrl}
							alt={item.altText || ''}
							class="w-full h-full object-cover"
						/>
						<div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/80 to-transparent p-2 text-white">
							<p class="text-[10px] font-semibold truncate">{item.format.toUpperCase()} • {formatBytes(item.bytes)}</p>
							{#if item.decorative}
								<span class="text-[9px] bg-slate-700/80 px-1 rounded">decorative</span>
							{:else}
								<span class="text-[9px] bg-emerald-600/80 px-1 rounded">alt text</span>
							{/if}
						</div>
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>

<!-- Asset Detail Drawer Modal -->
{#if selectedAsset}
	<div class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex justify-end">
		<div class="bg-white w-full max-w-md h-full shadow-2xl border-l border-slate-200 p-6 flex flex-col justify-between overflow-y-auto">
			<div class="space-y-5">
				<div class="flex items-center justify-between pb-3 border-b border-slate-200">
					<h3 class="text-base font-bold text-slate-900">Asset Details</h3>
					<button
						type="button"
						onclick={() => selectedAsset = null}
						class="text-slate-400 hover:text-slate-600 text-lg"
					>
						✕
					</button>
				</div>

				<div class="rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-100">
					<img
						src={selectedAsset.secureUrl}
						alt={selectedAsset.altText || ''}
						class="w-full h-full object-contain"
					/>
				</div>

				<div class="space-y-3 text-xs">
					<div>
						<span class="text-slate-400 font-medium">Public ID</span>
						<p class="font-mono text-slate-800 break-all">{selectedAsset.publicId}</p>
					</div>

					<div class="grid grid-cols-2 gap-2">
						<div>
							<span class="text-slate-400 font-medium">Dimensions</span>
							<p class="text-slate-800 font-bold">{selectedAsset.width} × {selectedAsset.height} px</p>
						</div>
						<div>
							<span class="text-slate-400 font-medium">File Size</span>
							<p class="text-slate-800 font-bold">{formatBytes(selectedAsset.bytes)}</p>
						</div>
					</div>

					<div>
						<span class="text-slate-400 font-medium">Alt Text</span>
						<p class="text-slate-800 italic">
							{selectedAsset.decorative ? '(Decorative image - empty alt)' : (selectedAsset.altText || 'Missing')}
						</p>
					</div>

					<div>
						<span class="text-slate-400 font-medium">Secure CDN URL</span>
						<input
							type="text"
							readonly
							value={selectedAsset.secureUrl}
							class="w-full mt-1 border border-slate-200 rounded-lg p-2 text-[11px] font-mono bg-slate-50 text-slate-700"
							onclick={(e) => (e.target as HTMLInputElement).select()}
						/>
					</div>

					<div>
						<span class="text-slate-400 font-medium">Referenced In Posts ({selectedAsset.posts?.length || 0})</span>
						{#if selectedAsset.posts?.length > 0}
							<ul class="mt-1 space-y-1">
								{#each selectedAsset.posts as p}
									<li class="text-indigo-600 hover:underline">
										<a href={`/admin/posts/${p.id}`} target="_blank">
											• {p.title}
										</a>
									</li>
								{/each}
							</ul>
						{:else}
							<p class="text-slate-500 mt-0.5">Not used in any post</p>
						{/if}
					</div>
				</div>
			</div>

			<div class="pt-6 border-t border-slate-200">
				<form
					method="POST"
					action="?/delete"
					use:enhance
					onsubmit={(e) => {
						if (!confirm(`Delete media asset "${selectedAsset.publicId}"? This will remove it from Cloudinary.`)) e.preventDefault();
					}}
				>
					<input type="hidden" name="id" value={selectedAsset.id} />
					<button
						type="submit"
						class="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition"
					>
						Delete Asset
					</button>
				</form>
			</div>
		</div>
	</div>
{/if}
