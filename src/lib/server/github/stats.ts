import { getGithubEnv } from './env'
import { getInstallationOctokit } from './octokit'

export type RepoStats = {
	closedIssues: number
	commits: number
}

function getTotalFromLinkHeader(link: string | undefined): number | undefined {
	if (!link) return undefined
	const lastMatch = link.match(/[?&]page=(\d+)[^>]*>; rel="last"/)
	if (lastMatch) return parseInt(lastMatch[1], 10)
	return undefined
}

export async function getRepoStats(): Promise<RepoStats> {
	const { owner, repo } = getGithubEnv()
	const octokit = await getInstallationOctokit()

	// Closed issues count
	const {
		data: { total_count: closedIssues }
	} = await octokit.rest.search.issuesAndPullRequests({
		q: `repo:${owner}/${repo} is:issue is:closed`
	})

	// Commits count
	const { headers: commitHeaders } = await octokit.rest.repos.listCommits({
		owner,
		repo,
		per_page: 1
	})
	const commits = getTotalFromLinkHeader(commitHeaders.link) ?? 0

	return {
		closedIssues,
		commits
	}
}
