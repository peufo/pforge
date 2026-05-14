import type { GithubIssue, GetIssuesParams } from '$lib/types'
import { getGithubEnv } from './env'
import { getInstallationOctokit } from './octokit'

export async function getGithubIssues(params?: GetIssuesParams): Promise<GithubIssue[]> {
	const { owner, repo } = getGithubEnv()
	const octokit = await getInstallationOctokit()

	const { data: issues } = await octokit.rest.issues.listForRepo({
		owner,
		repo,
		state: params?.state ?? 'all',
		per_page: 100
	})

	return issues as GithubIssue[]
}
