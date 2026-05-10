<script lang="ts">
	import { resolve } from '$app/paths'

	let copied = $state(false)

	function copyCode() {
		navigator.clipboard.writeText('bun add pforge')
		copied = true
		setTimeout(() => (copied = false), 2000)
	}
</script>

<section class="px-6 py-16 md:py-24 bg-paper-deep">
	<div class="max-w-2xl mx-auto text-center">
		<h2 class="text-2xl md:text-3xl font-semibold text-ink mb-4">Get started in seconds</h2>
		<p class="text-ink-secondary mb-10">A config file. Your roadmap is live.</p>

		<div class="bg-ink rounded-lg p-5 text-left overflow-hidden">
			<div class="flex items-center justify-between mb-3">
				<div class="flex gap-1.5">
					<span class="w-3 h-3 rounded-full bg-red-400/80"></span>
					<span class="w-3 h-3 rounded-full bg-amber-400/80"></span>
					<span class="w-3 h-3 rounded-full bg-green-400/80"></span>
				</div>
				<button
					onclick={copyCode}
					class="text-xs text-white/60 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
					aria-label={copied ? 'Copied' : 'Copy install command'}
				>
					{#if copied}
						<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 13l4 4L19 7"
							/></svg
						>
						Copied
					{:else}
						<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
							/></svg
						>
						Copy
					{/if}
				</button>
			</div>
			<code class="text-sm font-mono text-white/90">npm install pforge</code>
		</div>

		<a
			href={resolve('/docs/getting-started')}
			class="inline-flex items-center gap-2 mt-8 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
		>
			Read the full documentation
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M17 8l4 4m0 0l-4 4m4-4H3"
				/></svg
			>
		</a>
	</div>
</section>
