<script lang="ts">
	import GithubIssues from '$lib/components/GithubIssues.svelte'

	let { data } = $props()
</script>

<svelte:head>
	<title>Roadmap — pforge</title>
</svelte:head>

<main class="max-w-5xl mx-auto px-6 py-10">
	<h1 class="text-3xl font-bold text-ink mb-8">Roadmap</h1>
	<GithubIssues issues={data.issues} />
</main>
