<script lang="ts">
	import type { PageData } from './$types';
	import { formatDate, getResponsiveImageProps } from '#lib/utils';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Newsletter Issues — AI Tathastu Insights</title>
	<meta name="description" content="Archive of all editorial newsletter editions and issues from AI Tathastu Insights." />
	<link rel="canonical" href="https://aitathastu.info/newsletter" />
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
	<!-- Hub Header -->
	<div class="border-b border-[#E2E8F0] pb-8">
		<span class="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
			PUBLICATION ARCHIVE
		</span>
		<h1 class="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#0F172A] tracking-tight mt-1">
			Editorial Newsletter Issues
		</h1>
		<p class="text-base text-[#475569] mt-3 max-w-2xl leading-relaxed">
			Deep-dives, curated analyses, and state-of-the-art developments delivered straight to subscriber inboxes.
		</p>
	</div>

	<!-- Subscribe Banner inside Newsletter Hub -->
	<div class="bg-[#0F172A] text-white rounded-2xl p-8 sm:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8 shadow-sm border border-slate-800">
		<div class="max-w-xl space-y-2">
			<span class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-widest bg-[#CCFBF1]/20 text-[#CCFBF1] border border-[#CCFBF1]/30">
				WEEKLY DISPATCH
			</span>
			<h2 class="font-serif text-2xl sm:text-3xl font-semibold text-white tracking-tight">
				Never miss an edition
			</h2>
			<p class="text-sm text-slate-300">
				Subscribe to receive our upcoming releases directly in your inbox. Double opt-in, zero spam.
			</p>
		</div>
		<form method="POST" action="/subscribe" class="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
			<input type="text" name="b_url_honeypot" tabindex="-1" autocomplete="off" class="hidden" />
			<label for="newsletter-hub-email" class="sr-only">Email address</label>
			<input
				id="newsletter-hub-email"
				type="email"
				name="email"
				required
				autocomplete="email"
				placeholder="Your email address…"
				class="h-[48px] rounded-xl bg-white text-[#0F172A] text-sm px-4 placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-[#0F766E] w-full sm:w-72"
			/>
			<button
				type="submit"
				class="h-[48px] px-6 rounded-xl bg-[#0F766E] text-white text-sm font-semibold hover:bg-[#115E59] shrink-0 transition shadow-xs"
			>
				Subscribe
			</button>
		</form>
	</div>

	<!-- Issues Grid (DOM & Memory bounded to 12 items) -->
	{#if data.issues.length === 0}
		<div class="p-16 bg-white rounded-xl border border-[#E2E8F0] text-center text-slate-400 text-sm">
			No newsletter editions published yet.
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each data.issues as issue}
				{@const issueImg = getResponsiveImageProps(issue.coverMedia?.secureUrl, {
					alt: issue.coverMedia?.altText || issue.title,
					isHero: false,
					aspect: '16:9',
					sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px'
				})}
				<article class="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group">
					<div>
						<div class="aspect-video bg-slate-100 overflow-hidden relative">
							{#if issueImg}
								<img
									src={issueImg.src}
									srcset={issueImg.srcset}
									sizes={issueImg.sizes}
									alt={issueImg.alt}
									width={issueImg.width}
									height={issueImg.height}
									loading={issueImg.loading}
									decoding={issueImg.decoding}
									class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
								/>
							{:else}
								<div class="w-full h-full bg-linear-to-tr from-slate-800 to-teal-900 flex items-center justify-center text-white/50 font-serif text-lg">
									Newsletter
								</div>
							{/if}
						</div>
						<div class="p-6">
							<div class="flex items-center gap-2 mb-2">
								<span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#CCFBF1] text-[#0F766E]">
									NEWSLETTER
								</span>
								<span class="text-slate-300">•</span>
								<time datetime={new Date(issue.publishedAt || '').toISOString()} class="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
									{formatDate(issue.publishedAt)}
								</time>
							</div>
							<h3 class="font-serif text-[22px] font-semibold text-[#0F172A] leading-[1.3] group-hover:text-[#0F766E] group-hover:underline transition">
								<a href={`/newsletter/${issue.slug}`} data-sveltekit-preload-data="hover">{issue.title}</a>
							</h3>
							{#if issue.excerpt}
								<p class="mt-2 text-[15px] text-[#475569] line-clamp-3 leading-relaxed">
									{issue.excerpt}
								</p>
							{/if}
						</div>
					</div>

					<div class="px-6 py-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-slate-400">
						<span class="font-medium text-[#0F172A]">{issue.author.name}</span>
						<span>{issue.readingMinutes} min read</span>
					</div>
				</article>
			{/each}
		</div>
	{/if}
</div>
