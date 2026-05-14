<script lang="ts">
	import { page } from '$app/state'
	import { resolve } from '$app/paths'

	let { children } = $props()

	let mobileOpen = $state(false)

	const nav = [
		{
			section: 'Guide',
			items: [{ href: '/docs/getting-started', label: 'Getting Started' }]
		}
	] as const

	function isActive(href: string) {
		return page.url.pathname === href
	}
</script>

<svelte:head>
	<title>Documentation — pforge</title>
</svelte:head>

<div class="min-h-screen flex flex-col">
	<header class="sticky top-0 z-30 border-b border-clay-border bg-paper/80 backdrop-blur-sm">
		<div class="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
			<a href={resolve('/')} class="flex items-center gap-2.5">
				<img src="/logo.svg" class="w-6 h-6" alt="" />
				<span class="font-bold text-ink">pforge</span>
			</a>

			<div class="flex items-center gap-6">
				<a
					href={resolve('/')}
					class="hidden sm:inline-flex text-sm text-ink-secondary hover:text-ink transition-colors"
				>
					Back to home
				</a>
				<button
					class="sm:hidden p-2 -mr-2 text-ink-secondary hover:text-ink"
					onclick={() => (mobileOpen = !mobileOpen)}
					aria-label="Toggle navigation"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						{#if mobileOpen}
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						{:else}
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							/>
						{/if}
					</svg>
				</button>
			</div>
		</div>
	</header>

	<div class="flex-1 max-w-7xl mx-auto w-full flex">
		<aside
			class="fixed inset-y-0 left-0 z-20 w-64 pt-14 pb-6 px-6 overflow-y-auto border-r border-clay-border bg-paper transform transition-transform duration-200 sm:translate-x-0 sm:static sm:block"
			class:-translate-x-full={!mobileOpen}
			class:translate-x-0={mobileOpen}
		>
			<nav class="mt-6 space-y-8">
				{#each nav as group (group.section)}
					<div>
						<h3 class="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-3">
							{group.section}
						</h3>
						<ul class="space-y-1">
							{#each group.items as item (item.href)}
								<li>
									<a
										href={resolve(item.href)}
										class="block px-3 py-2 text-sm rounded-md transition-colors {isActive(item.href)
											? 'bg-primary-subtle text-primary font-medium'
											: 'text-ink-secondary hover:bg-clay hover:text-ink'}"
										onclick={() => (mobileOpen = false)}
									>
										{item.label}
									</a>
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</nav>
		</aside>

		{#if mobileOpen}
			<div
				class="fixed inset-0 z-10 bg-ink/20 sm:hidden"
				onclick={() => (mobileOpen = false)}
				aria-hidden="true"
			></div>
		{/if}

		<main class="flex-1 min-w-0 px-6 py-10 sm:py-14 sm:px-12 lg:px-16">
			<div class="max-w-3xl">
				{@render children()}
			</div>
		</main>
	</div>
</div>
