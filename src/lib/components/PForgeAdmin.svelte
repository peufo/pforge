<script lang="ts">
	import { onMount } from 'svelte'
	import type { PForgeStatus, PForgeSummary } from '$lib/types'
	import { PFORGE_BASE } from '$lib/constant'

	let status = $state<PForgeStatus | null>(null)
	let loading = $state(true)
	let error = $state('')
	let summaries = $state<PForgeSummary[]>([])
	let summariesLoading = $state(false)
	let editingId = $state<string | null>(null)
	let editTitle = $state('')
	let editBody = $state('')
	let newPeriodStart = $state('')
	let newPeriodEnd = $state('')
	let newTitle = $state('')
	let newBody = $state('')
	let generateLoading = $state(false)

	async function fetchStatus() {
		try {
			const res = await fetch(`${PFORGE_BASE}/status`)
			status = (await res.json()) as PForgeStatus
		} catch {
			status = { connected: false }
		}
	}

	async function fetchSummaries() {
		summariesLoading = true
		try {
			const res = await fetch(`${PFORGE_BASE}/summaries`)
			summaries = (await res.json()) as PForgeSummary[]
		} catch {
			summaries = []
		}
		summariesLoading = false
	}

	async function generateSummary() {
		if (!newPeriodStart || !newPeriodEnd || !newTitle || !newBody) return
		generateLoading = true
		try {
			const res = await fetch(`${PFORGE_BASE}/summaries`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					periodStart: newPeriodStart,
					periodEnd: newPeriodEnd,
					title: newTitle,
					body: newBody
				})
			})
			if (res.ok) {
				newPeriodStart = ''
				newPeriodEnd = ''
				newTitle = ''
				newBody = ''
				await fetchSummaries()
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to generate summary'
		}
		generateLoading = false
	}

	async function saveEdit() {
		if (!editingId) return
		try {
			const res = await fetch(`${PFORGE_BASE}/summaries/${editingId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ title: editTitle, body: editBody })
			})
			if (res.ok) {
				editingId = null
				await fetchSummaries()
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to save'
		}
	}

	function startEdit(summary: PForgeSummary) {
		editingId = summary.id
		editTitle = summary.title
		editBody = summary.body
	}

	function cancelEdit() {
		editingId = null
		editTitle = ''
		editBody = ''
	}

	onMount(async () => {
		await fetchStatus()
		if (status?.connected) {
			await fetchSummaries()
		}
		loading = false
	})
</script>

<div class="max-w-4xl mx-auto px-6 py-8">
	{#if loading}
		<div class="flex items-center justify-center py-20">
			<div
				class="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"
			></div>
			<span class="ml-3 text-ink-secondary">Loading...</span>
		</div>
	{:else if !status?.connected}
		<div class="bg-paper rounded-lg border border-clay-border p-8">
			<h2 class="text-2xl font-semibold text-ink mb-2">GitHub App not configured</h2>
			<p class="text-ink-secondary mb-6">
				You need a GitHub App to connect your repository. Create one manually and add the
				credentials to your <code>.env</code> file.
			</p>
			<a
				href="https://github.com/settings/apps/new"
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center px-5 py-2.5 bg-primary text-white font-medium rounded-md hover:bg-primary-hover transition-colors"
			>
				Create GitHub App
				<svg class="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
					/></svg
				>
			</a>
		</div>
	{:else}
		<div class="space-y-8">
			<!-- Status card -->
			<div class="bg-paper rounded-lg border border-clay-border p-6">
				<div class="flex items-center gap-3 mb-4">
					<span class="w-2.5 h-2.5 rounded-full bg-green-500"></span>
					<h2 class="text-xl font-semibold text-ink">GitHub Connected</h2>
				</div>
				<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
					<div>
						<span class="text-ink-muted">Owner</span>
						<p class="font-medium text-ink">{status?.owner || '—'}</p>
					</div>
					<div>
						<span class="text-ink-muted">Repo</span>
						<p class="font-medium text-ink">{status?.repo || '—'}</p>
					</div>
					<div>
						<span class="text-ink-muted">App ID</span>
						<p class="font-medium text-ink">{status?.appId || '—'}</p>
					</div>
				</div>
			</div>

			<!-- Generate summary -->
			<div class="bg-paper rounded-lg border border-clay-border p-6">
				<h3 class="text-lg font-semibold text-ink mb-4">Generate Summary</h3>
				{#if error}
					<div class="bg-red-50 border border-red-200 text-red-700 rounded-md p-4 mb-4">
						{error}
					</div>
				{/if}
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
					<div>
						<label for="pforge-from" class="block text-sm font-medium text-ink mb-1.5">From</label>
						<input
							id="pforge-from"
							type="date"
							bind:value={newPeriodStart}
							class="w-full px-3.5 py-2.5 bg-white border border-clay-border rounded-md text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
						/>
					</div>
					<div>
						<label for="pforge-to" class="block text-sm font-medium text-ink mb-1.5">To</label>
						<input
							id="pforge-to"
							type="date"
							bind:value={newPeriodEnd}
							class="w-full px-3.5 py-2.5 bg-white border border-clay-border rounded-md text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
						/>
					</div>
				</div>
				<div class="mb-4">
					<label for="pforge-title" class="block text-sm font-medium text-ink mb-1.5">Title</label>
					<input
						id="pforge-title"
						type="text"
						bind:value={newTitle}
						placeholder="e.g. Q1 2025 Update"
						class="w-full px-3.5 py-2.5 bg-white border border-clay-border rounded-md text-ink placeholder-ink-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
					/>
				</div>
				<div class="mb-4">
					<label for="pforge-body" class="block text-sm font-medium text-ink mb-1.5">Body</label>
					<textarea
						id="pforge-body"
						bind:value={newBody}
						rows="4"
						placeholder="Summary content..."
						class="w-full px-3.5 py-2.5 bg-white border border-clay-border rounded-md text-ink placeholder-ink-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y"
					></textarea>
				</div>
				<button
					onclick={generateSummary}
					disabled={!newPeriodStart || !newPeriodEnd || !newTitle || generateLoading}
					class="px-5 py-2.5 bg-primary text-white font-medium rounded-md hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
				>
					{generateLoading ? 'Generating...' : 'Generate Summary'}
				</button>
			</div>

			<!-- Summaries list -->
			<div class="bg-paper rounded-lg border border-clay-border p-6">
				<h3 class="text-lg font-semibold text-ink mb-4">History</h3>
				{#if summariesLoading}
					<div class="flex items-center justify-center py-8">
						<div
							class="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"
						></div>
					</div>
				{:else if summaries.length === 0}
					<p class="text-ink-muted text-sm py-4">
						No summaries yet. Generate your first one above.
					</p>
				{:else}
					<div class="space-y-4">
						{#each summaries as summary (summary.id)}
							<div
								class="border border-clay-border rounded-md p-4 hover:border-clay transition-colors"
							>
								{#if editingId === summary.id}
									<div class="space-y-3">
										<input
											type="text"
											bind:value={editTitle}
											class="w-full px-3 py-2 bg-white border border-clay-border rounded-md text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
										/>
										<textarea
											bind:value={editBody}
											rows="4"
											class="w-full px-3 py-2 bg-white border border-clay-border rounded-md text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y"
										></textarea>
										<div class="flex gap-2">
											<button
												onclick={saveEdit}
												class="px-4 py-1.5 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-hover transition-colors cursor-pointer"
												>Save</button
											>
											<button
												onclick={cancelEdit}
												class="px-4 py-1.5 bg-clay text-ink text-sm font-medium rounded-md hover:bg-clay-border transition-colors cursor-pointer"
												>Cancel</button
											>
										</div>
									</div>
								{:else}
									<div class="flex items-start justify-between gap-4">
										<div class="flex-1 min-w-0">
											<h4 class="font-medium text-ink text-sm">{summary.title}</h4>
											<p class="text-xs text-ink-muted mt-1">
												{summary.periodStart} → {summary.periodEnd}
											</p>
											<p class="text-sm text-ink-secondary mt-2 line-clamp-3">{summary.body}</p>
										</div>
										<button
											onclick={() => startEdit(summary)}
											class="text-xs text-primary hover:text-primary-hover font-medium transition-colors cursor-pointer flex-shrink-0"
											>Edit</button
										>
									</div>
								{/if}
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
