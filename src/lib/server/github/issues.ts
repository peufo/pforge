import type { GithubIssue } from '$lib/types'
import { getGithubEnv } from './env'
import { getInstallationOctokit } from './octokit'

export async function getGithubIssues(): Promise<GithubIssue[]> {
	const { owner, repo } = getGithubEnv()
	const octokit = await getInstallationOctokit()

	const { data: issues } = await octokit.rest.issues.listForRepo({
		owner,
		repo,
		state: 'all',
		per_page: 100
	})

	return issues as GithubIssue[]
}
