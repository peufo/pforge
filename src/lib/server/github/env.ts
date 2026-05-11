export type GithubEnv = {
	appId: string
	privateKey: string
	owner: string
	repo: string
}

export function getGithubEnv(): GithubEnv {
	const appId = process.env.GITHUB_APP_ID
	const privateKey = process.env.GITHUB_PRIVATE_KEY
	const owner = process.env.GITHUB_OWNER
	const repo = process.env.GITHUB_REPO

	if (!appId) throw new Error('Missing environment variable: GITHUB_APP_ID')
	if (!privateKey) throw new Error('Missing environment variable: GITHUB_PRIVATE_KEY')
	if (!owner) throw new Error('Missing environment variable: GITHUB_OWNER')
	if (!repo) throw new Error('Missing environment variable: GITHUB_REPO')

	return { appId, privateKey, owner, repo }
}
