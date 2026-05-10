import { PFORGE_BASE } from '$lib/constant'
import { json, type RequestEvent } from '@sveltejs/kit'
import { getGithubIssues } from './github/issues'

type Endpoint = (event: RequestEvent) => Promise<unknown>

export async function pforgeServerApi(event: RequestEvent): Promise<Response | null> {
	const pathname = event.url.pathname
	const method = event.request.method
	if (!pathname.startsWith(PFORGE_BASE)) return null
	const endpointPath = pathname.replace(PFORGE_BASE, '')
	const endpoint = (api as APIShape)[endpointPath]?.[method]
	if (!endpoint) return null
	const res = await endpoint(event)
	return json(res)
}

type APIShape = Record<string, Partial<Record<string, Endpoint>>>
export type PForgeServerAPI = typeof api

const api = {
	'/issues': {
		get: getGithubIssues
	}
} satisfies APIShape
