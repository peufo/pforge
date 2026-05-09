<script lang="ts">
	const features = [
		{
			icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`,
			title: 'LLM-Powered Summaries',
			desc: 'GitHub issues are turned into clear, human-readable updates your users actually understand.'
		},
		{
			icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>`,
			title: 'Anonymous Upvotes',
			desc: 'Users can vote for features and leave comments without ever creating a GitHub account.'
		},
		{
			icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`,
			title: 'Timeline & Kanban',
			desc: 'Switch between a chronological timeline and a status-based kanban board in one click.'
		},
		{
			icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>`,
			title: 'Zero Database',
			desc: 'Everything lives in GitHub. No Postgres, no Redis, no infrastructure to maintain.'
		}
	]
</script>

<section class="px-6 py-16 md:py-24">
	<div class="max-w-5xl mx-auto">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
			{#each features as f (f.title)}
				<div class="flex gap-5">
					<div
						class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-md bg-primary-subtle text-primary"
					>
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						{@html f.icon}
					</div>
					<div>
						<h3 class="font-semibold text-ink mb-2">{f.title}</h3>
						<p class="text-sm text-ink-secondary leading-relaxed">{f.desc}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
