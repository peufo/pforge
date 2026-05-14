import { getGithubIssues } from '$lib/server/github/issues'
import { getRepoStats } from '$lib/server/github/stats'

export const load = async () => {
	return {
		issues: await getGithubIssues({ state: 'open' }),
		stats: await getRepoStats()
	}
}
