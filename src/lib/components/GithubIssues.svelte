<script lang="ts">
	import type { GithubIssue } from '$lib/types'
	import { pforgeApi } from '$lib/api'

	type Props = {
		issues?: GithubIssue[]
	}

	let { issues }: Props = $props()

	let issuesState = $state<GithubIssue[] | undefined>(undefined)
	let loading = $state(true)
	let error = $state<string | null>(null)

	async function loadIssues() {
		loading = true
		error = null
		try {
			issuesState = await pforgeApi['/issues']()
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load issues'
		} finally {
			loading = false
		}
	}

	$effect(() => {
		if (issues) {
			issuesState = issues
			loading = false
			error = null
		} else {
			loadIssues()
		}
	})

	function statusFromIssue(issue: GithubIssue): 'open' | 'closed' {
		return issue.state
	}
</script>

{#if loading}
	<div class="py-12 text-center">
		<div
			class="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"
		></div>
		<p class="mt-3 text-sm text-ink-muted">Loading issues...</p>
	</div>
{:else if error}
	<div class="py-12 text-center">
		<p class="text-sm text-red-600">{error}</p>
		<button
			onclick={loadIssues}
			class="mt-3 text-sm font-medium text-primary hover:text-primary-hover transition-colors cursor-pointer"
		>
			Try again
		</button>
	</div>
{:else if !issuesState || issuesState.length === 0}
	<div class="py-12 text-center">
		<p class="text-sm text-ink-muted">No issues found.</p>
	</div>
{:else}
	<div class="divide-y divide-clay-border">
		{#each issuesState as issue (issue.id)}
			<div class="p-5 hover:bg-paper transition-colors">
				<div class="flex items-start gap-4">
					<div class="flex-shrink-0 mt-0.5">
						{#if statusFromIssue(issue) === 'open'}
							<span
								class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary-subtle text-primary"
							>
								<span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
								Open
							</span>
						{:else}
							<span
								class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
							>
								<span class="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
								Closed
							</span>
						{/if}
					</div>
					<div class="flex-1 min-w-0">
						<h3 class="font-semibold text-ink mb-1">
							<!-- eslint-disable svelte/no-navigation-without-resolve -->
							<a
								href={issue.html_url}
								target="_blank"
								rel="noopener noreferrer"
								class="hover:text-primary transition-colors"
							>
								#{issue.number}
								{issue.title}
							</a>
							<!-- eslint-enable svelte/no-navigation-without-resolve -->
						</h3>
						{#if issue.body}
							<p class="text-sm text-ink-secondary leading-relaxed mb-3 line-clamp-2">
								{issue.body}
							</p>
						{/if}
						<div class="flex items-center gap-4 text-xs text-ink-muted">
							{#if issue.user}
								<span class="inline-flex items-center gap-1.5">
									<img
										src={issue.user.avatar_url}
										alt={issue.user.login}
										class="w-4 h-4 rounded-full"
									/>
									{issue.user.login}
								</span>
							{/if}
							<span>{new Date(issue.created_at).toLocaleDateString()}</span>
							{#if issue.labels.length > 0}
								<span class="flex items-center gap-1">
									{#each issue.labels as label (label.name)}
										<span
											class="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium"
											style="background-color: #{label.color}; color: {parseInt(label.color, 16) >
											0x7fffff
												? '#1a1a1a'
												: '#ffffff'}"
										>
											{label.name}
										</span>
									{/each}
								</span>
							{/if}
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>
{/if}
