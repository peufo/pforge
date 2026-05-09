export type ManifestOptions = {
	name: string
	owner: string
	repo: string
	redirectUrl: string
}

export type GitHubAppCredentials = {
	id: number
	slug: string
	node_id: string
	owner: {
		login: string
	}
	name: string
	description: string | null
	external_url: string
	html_url: string
	created_at: string
	updated_at: string
	client_id: string
	client_secret: string
	webhook_secret: string | null
	pem: string
}

export function buildManifest(options: ManifestOptions): Record<string, unknown> {
	return {
		name: options.name,
		url: 'https://github.com',
		callback_urls: [options.redirectUrl],
		hook_attributes: {
			url: options.redirectUrl
		},
		redirect_url: options.redirectUrl,
		description: `pforge app for ${options.owner}/${options.repo}`,
		public: false,
		default_events: ['issues', 'issue_comment'],
		default_permissions: {
			issues: 'write',
			discussions: 'read'
		}
	}
}

export async function exchangeCodeForCredentials(code: string): Promise<GitHubAppCredentials> {
	const response = await fetch(`https://api.github.com/app-manifests/${code}/conversions`, {
		method: 'POST',
		headers: {
			Accept: 'application/vnd.github+json',
			'X-GitHub-Api-Version': '2022-11-28'
		}
	})

	if (!response.ok) {
		const body = await response.text()
		throw new Error(`GitHub API error (${response.status}): ${body}`)
	}

	return response.json() as Promise<GitHubAppCredentials>
}
