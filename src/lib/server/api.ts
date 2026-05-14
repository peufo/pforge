import { PFORGE_BASE } from '$lib/constant'
import { json, type RequestEvent } from '@sveltejs/kit'
import { getGithubIssues } from './github/issues'
import { getRepoStats } from './github/stats'
import type { GetIssuesParams, GithubIssue, RepoStats } from '$lib/types'

export type PForgeServerAPI = {
	'/issues': {
		params: GetIssuesParams
		response: GithubIssue[]
	}
	'/stats': {
		params: void
		response: RepoStats
	}
}

type ServerImpl = {
	[K in keyof PForgeServerAPI]: {
		get: (
			params: PForgeServerAPI[K]['params'],
			event: RequestEvent
		) => Promise<PForgeServerAPI[K]['response']>
	}
}

const api: ServerImpl = {
	'/issues': {
		get: async (params) => {
			return getGithubIssues(params)
		}
	},
	'/stats': {
		get: async () => {
			return getRepoStats()
		}
	}
}

export async function pforgeServerApi(event: RequestEvent): Promise<Response | null> {
	const pathname = event.url.pathname
	const method = event.request.method.toLowerCase() as 'get'
	if (!pathname.startsWith(PFORGE_BASE)) return null
	const endpointPath = pathname.replace(PFORGE_BASE, '') as keyof PForgeServerAPI
	const endpoint = api[endpointPath]?.[method]
	if (!endpoint) return null

	const rawParams = Object.fromEntries(event.url.searchParams)
	const res = await (endpoint as (...args: unknown[]) => Promise<unknown>)(rawParams, event)
	return json(res)
}
