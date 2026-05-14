import { PFORGE_BASE } from '$lib/constant'
import { json, type RequestEvent } from '@sveltejs/kit'
import { getGithubIssues } from './github/issues'
import type { GetIssuesParams, GithubIssue } from '$lib/types'

export type PForgeServerAPI = {
	'/issues': {
		params: GetIssuesParams
		response: GithubIssue[]
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
	const res = await endpoint(rawParams as PForgeServerAPI[keyof PForgeServerAPI]['params'], event)
	return json(res)
}
