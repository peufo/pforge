import { getGithubIssues } from '$lib/server/github/issues'

export const load = async () => {
	return {
		issues: await getGithubIssues()
	}
}
