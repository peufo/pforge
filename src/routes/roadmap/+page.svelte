<script lang="ts">
	import GithubIssues from '$lib/components/GithubIssues.svelte'
	import RepoStats from '$lib/components/RepoStats.svelte'

	let { data } = $props()
</script>

<svelte:head>
	<title>Roadmap — pforge</title>
</svelte:head>

<main class="max-w-5xl mx-auto px-6 py-10 space-y-10">
	<h1 class="text-3xl font-bold text-ink">Roadmap</h1>

	<RepoStats stats={data.stats} />

	<section>
		<h2 class="text-xl font-semibold text-ink mb-4">Issues</h2>
		<GithubIssues issues={data.issues} />
	</section>
</main>
