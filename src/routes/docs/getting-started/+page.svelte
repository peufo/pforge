<script lang="ts">
	let copied = $state(false)

	function copyEnv() {
		navigator.clipboard.writeText(
			'GITHUB_APP_ID=123456\nGITHUB_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\\n...\\n-----END RSA PRIVATE KEY-----"'
		)
		copied = true
		setTimeout(() => (copied = false), 2000)
	}

	const steps = [
		{
			number: '01',
			title: 'Create a GitHub App',
			content:
				'<p class="mb-3">Go to <a href="https://github.com/settings/apps/new" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-primary-hover underline underline-offset-2">github.com/settings/apps/new</a> and fill in the following fields:</p>' +
				'<ul class="space-y-2 mb-4">' +
				'<li class="flex items-start gap-2"><span class="text-primary mt-0.5">&#x2192;</span><span><strong>GitHub App name</strong> — something like <code>pforge-your-repo</code> (must be unique across GitHub)</span></li>' +
				'<li class="flex items-start gap-2"><span class="text-primary mt-0.5">&#x2192;</span><span><strong>Homepage URL</strong> — your site or repository URL</span></li>' +
				'<li class="flex items-start gap-2"><span class="text-primary mt-0.5">&#x2192;</span><span><strong>Webhook URL</strong> — your site URL (or leave blank for now)</span></li>' +
				'<li class="flex items-start gap-2"><span class="text-primary mt-0.5">&#x2192;</span><span><strong>Webhook secret</strong> — leave blank, you can add one later</span></li>' +
				'</ul>' +
				'<p class="mb-3 font-medium text-ink">Required repository permissions:</p>' +
				'<ul class="space-y-2 mb-4">' +
				'<li class="flex items-start gap-2"><span class="text-primary mt-0.5">&#x2192;</span><span><strong>Issues</strong> — Read & write</span></li>' +
				'<li class="flex items-start gap-2"><span class="text-primary mt-0.5">&#x2192;</span><span><strong>Discussions</strong> — Read-only</span></li>' +
				'</ul>' +
				'<p class="mb-3 font-medium text-ink">Subscribe to events:</p>' +
				'<ul class="space-y-2">' +
				'<li class="flex items-start gap-2"><span class="text-primary mt-0.5">&#x2192;</span><span>Issues</span></li>' +
				'<li class="flex items-start gap-2"><span class="text-primary mt-0.5">&#x2192;</span><span>Issue comment</span></li>' +
				'</ul>'
		},
		{
			number: '02',
			title: 'Generate a private key',
			content:
				'After creating the app, scroll to <strong>Private keys</strong> and click <strong>Generate a private key</strong>. A <code>.pem</code> file will download automatically. Keep it safe — you will need its contents for the next step.'
		},
		{
			number: '03',
			title: 'Install the app on your repository',
			content:
				'In the left sidebar of your app settings, click <strong>Install App</strong>. Select your account, then choose the repository you want to connect. Click <strong>Install</strong>.'
		},
		{
			number: '04',
			title: 'Add credentials to .env',
			content:
				'Create or edit <code>.env</code> in your project root with the values from your GitHub App settings page and the downloaded private key.'
		},
		{
			number: '05',
			title: 'Restart your server',
			content:
				'SvelteKit reads <code>.env</code> at startup. Restart the dev server for the changes to take effect.'
		}
	]
</script>

<svelte:head>
	<title>Getting Started — pforge</title>
	<meta
		name="description"
		content="Learn how to create and register a GitHub App for pforge manually."
	/>
</svelte:head>

<div class="space-y-12">
	<div>
		<h1 class="text-3xl sm:text-4xl font-bold text-ink leading-tight mb-4">Getting Started</h1>
		<p class="text-lg text-ink-secondary leading-relaxed max-w-2xl mb-4">
			Set up pforge in minutes by creating a GitHub App manually. Five steps and you are ready to
			ship.
		</p>
		<p class="text-sm text-ink-secondary leading-relaxed max-w-2xl">
			A <strong>GitHub App</strong> is required because pforge needs authenticated access to your repository.
			It reads issues and discussions to build the roadmap, and writes upvotes and comments on behalf
			of your users — all without forcing them to create GitHub accounts. The app acts as a bridge between
			your public roadmap and GitHub's API.
		</p>
	</div>

	<div class="space-y-10">
		{#each steps as step (step.number)}
			<div class="flex gap-5 sm:gap-6">
				<div
					class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-md bg-primary-subtle"
				>
					<span class="text-sm font-bold text-primary">{step.number}</span>
				</div>
				<div class="pt-1 flex-1 min-w-0">
					<h2 class="text-lg font-semibold text-ink mb-2">{step.title}</h2>
					<div class="text-sm text-ink-secondary leading-relaxed">
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						{@html step.content}
					</div>
				</div>
			</div>
		{/each}
	</div>

	<div class="bg-paper-deep border border-clay-border rounded-lg p-5">
		<h2 class="text-sm font-semibold text-ink mb-2">
			Why a private key and not just the client secret?
		</h2>
		<p class="text-sm text-ink-secondary leading-relaxed mb-2">
			A GitHub App has <strong>two</strong> authentication mechanisms. They are not interchangeable:
		</p>
		<ul class="space-y-2 text-sm text-ink-secondary mb-3">
			<li class="flex items-start gap-2">
				<span class="text-primary mt-0.5">&#x2192;</span>
				<span>
					<strong>Client secret</strong> — used for OAuth user-to-server flows. A user authorizes
					the app to act on their behalf. This gives a <em>user access token</em>.
				</span>
			</li>
			<li class="flex items-start gap-2">
				<span class="text-primary mt-0.5">&#x2192;</span>
				<span>
					<strong>Private key</strong> — used for server-to-server JWT authentication. The app signs
					a JWT with its private key, exchanges it for an <em>installation access token</em>, and
					uses that token to call the GitHub API.
				</span>
			</li>
		</ul>
		<p class="text-sm text-ink-secondary leading-relaxed">
			pforge reads issues and writes upvotes/comments from the server. This requires an
			<em>installation access token</em>, which can only be obtained with the
			<strong>private key</strong>. The client secret alone cannot make server-to-server API calls.
		</p>
	</div>

	<div class="bg-ink rounded-lg p-5 overflow-hidden">
		<div class="flex items-center justify-between mb-3">
			<div class="flex gap-1.5">
				<span class="w-3 h-3 rounded-full bg-red-400/80"></span>
				<span class="w-3 h-3 rounded-full bg-amber-400/80"></span>
				<span class="w-3 h-3 rounded-full bg-green-400/80"></span>
			</div>
			<button
				onclick={copyEnv}
				class="text-xs text-white/60 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
				aria-label={copied ? 'Copied' : 'Copy env example'}
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
		<pre class="text-sm font-mono text-white/90 overflow-x-auto"><code
				>GITHUB_APP_ID=123456
GITHUB_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA...\n-----END RSA PRIVATE KEY-----"</code
			></pre>
	</div>

	<div class="border-t border-clay-border pt-10">
		<h2 class="text-lg font-semibold text-ink mb-3">Troubleshooting</h2>
		<div class="space-y-4 text-sm text-ink-secondary leading-relaxed">
			<div>
				<h3 class="font-medium text-ink mb-1">GitHub App not configured</h3>
				<p>
					Make sure the server was restarted after editing <code>.env</code>. Check that
					<code>GITHUB_APP_ID</code> contains only numbers and that
					<code>GITHUB_PRIVATE_KEY</code> is properly quoted with newlines escaped as
					<code>\n</code>.
				</p>
			</div>
			<div>
				<h3 class="font-medium text-ink mb-1">App cannot access repository issues</h3>
				<p>
					Go to your GitHub App settings &rarr; Install App. Ensure the app is installed on the
					correct repository and that the <strong>Issues</strong> permission is set to
					<strong>Read & write</strong>.
				</p>
			</div>
		</div>
	</div>

	<div class="border-t border-clay-border pt-10">
		<h2 class="text-lg font-semibold text-ink mb-3">Next steps</h2>
		<ul class="space-y-2 text-sm text-ink-secondary">
			<li class="flex items-start gap-2">
				<span class="text-primary mt-0.5">&#x2192;</span>
				<span>Import pforge components into your SvelteKit page.</span>
			</li>
			<li class="flex items-start gap-2">
				<span class="text-primary mt-0.5">&#x2192;</span>
				<span>Configure your roadmap columns and status mapping.</span>
			</li>
			<li class="flex items-start gap-2">
				<span class="text-primary mt-0.5">&#x2192;</span>
				<span>Customize the styling to match your brand.</span>
			</li>
		</ul>
	</div>
</div>
