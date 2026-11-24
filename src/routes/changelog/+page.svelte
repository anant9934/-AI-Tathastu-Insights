<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function getBadge(type: string | null | undefined) {
		switch (type) {
			case 'new':
				return { label: 'NEW', class: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
			case 'improved':
				return { label: 'IMPROVED', class: 'bg-sky-50 text-sky-800 border-sky-200' };
			case 'fixed':
				return { label: 'FIXED', class: 'bg-amber-50 text-amber-800 border-amber-200' };
			case 'breaking':
				return { label: 'BREAKING', class: 'bg-rose-50 text-rose-800 border-rose-200' };
			default:
				return { label: 'RELEASE', class: 'bg-slate-100 text-slate-800 border-slate-200' };
		}
	}

	function formatDate(d: any) {
		if (!d) return '';
		return new Date(d).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		}).toUpperCase();
	}
</script>

<svelte:head>
	<title>Product Changelog — AI Tathastu Insights</title>
	<meta name="description" content="Release notes, features, fixes, and product updates from AI Tathastu." />
	<link rel="canonical" href="https://aitathastu.info/changelog" />
</svelte:head>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
	<!-- Header -->
	<div class="border-b border-[#E2E8F0] pb-8">
		<span class="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
			RELEASE NOTES
		</span>
		<h1 class="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#0F172A] tracking-tight mt-1">
			Product Changelog
		</h1>
		<p class="text-base text-[#475569] mt-3 max-w-2xl leading-relaxed">
			Continuous release notes, feature highlights, optimizations, and technical updates.
		</p>
	</div>

	{#if Object.keys(data.grouped).length === 0}
		<div class="p-16 bg-white rounded-xl border border-[#E2E8F0] text-center text-slate-400 text-sm">
			No changelog entries published yet.
		</div>
	{:else}
		<div class="space-y-16">
			{#each Object.entries(data.grouped) as [month, entries]}
				<div class="space-y-8">
					<h2 class="font-serif text-xl sm:text-2xl font-semibold text-[#0F172A] border-b border-[#E2E8F0] pb-3">
						{month}
					</h2>

					<!-- Continuous Timeline Visual with vertical line and node dots -->
					<div class="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2 sm:before:left-2.5 before:top-4 before:bottom-4 before:w-[2px] before:bg-[#E2E8F0]">
						{#each entries as item}
							{@const badge = getBadge(item.changelogType)}
							<article id={item.slug} class="relative bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs hover:shadow-sm transition group">
								<!-- Timeline node dot -->
								<div class="absolute -left-[29px] sm:-left-[35px] top-7 w-3 h-3 rounded-full bg-[#0F766E] border-2 border-[#F8F7F4] shadow-xs"></div>

								<div class="space-y-3">
									<div class="flex items-center justify-between gap-4">
										<div class="flex items-center gap-2.5">
											<span class={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${badge.class}`}>
												{badge.label}
											</span>
											<time datetime={new Date(item.publishedAt || '').toISOString()} class="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
												{formatDate(item.publishedAt)}
											</time>
										</div>
										<span class="text-xs text-slate-400 font-mono">v{item.slug.replace(/[^0-9.]/g, '') || '2.x'}</span>
									</div>

									<h3 class="font-serif text-xl font-semibold text-[#0F172A] group-hover:text-[#0F766E] transition">
										{item.title}
									</h3>

									{#if item.contentHtml}
										<div class="prose prose-slate max-w-none text-sm text-[#475569] leading-relaxed pt-1">
											{@html item.contentHtml}
										</div>
									{:else if item.excerpt}
										<p class="text-sm text-[#475569] leading-relaxed">
											{item.excerpt}
										</p>
									{/if}
								</div>
							</article>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
