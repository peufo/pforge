<script lang="ts">
	import type { RepoStats } from '$lib/types'
	import { pforgeApi } from '$lib/api'
	import { useHybridData } from '$lib/hybrid-data.svelte'

	type Props = {
		stats?: RepoStats
	}

	let { stats }: Props = $props()

	const { data, loading, error, reload } = useHybridData<RepoStats>(
		() => stats,
		() => pforgeApi['/stats']()
	)

	const items = $derived(
		data
			? [
					{ label: 'Issues closed', value: data.closedIssues },
					{ label: 'Commits', value: data.commits }
				]
			: []
	)
</script>

{#if loading}
	<div class="py-8 text-center">
		<div
			class="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"
		></div>
		<p class="mt-3 text-sm text-ink-muted">Loading stats...</p>
	</div>
{:else if error}
	<div class="py-8 text-center">
		<p class="text-sm text-red-600">{error}</p>
		<button
			onclick={reload}
			class="mt-3 text-sm font-medium text-primary hover:text-primary-hover transition-colors cursor-pointer"
		>
			Try again
		</button>
	</div>
{:else if items.length > 0}
	<div class="grid grid-cols-2 gap-4">
		{#each items as item (item.label)}
			<div class="bg-paper border border-clay-border rounded-lg p-4 text-center">
				<p class="text-2xl font-bold text-ink">{item.value.toLocaleString()}</p>
				<p class="text-xs text-ink-muted mt-1 uppercase tracking-wide">{item.label}</p>
			</div>
		{/each}
	</div>
{/if}
