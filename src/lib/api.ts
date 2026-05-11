import type { PForgeServerAPI } from '$lib/server/api'
import { PFORGE_BASE } from './constant'

type EndpointPath = keyof PForgeServerAPI

type EndpointResponse<E extends EndpointPath> = PForgeServerAPI[E] extends {
	get?: (...args: unknown[]) => Promise<infer R>
}
	? R
	: never

type ApiClient = {
	[E in EndpointPath]: () => Promise<EndpointResponse<E>>
}

function useApiGetter<E extends EndpointPath>(route: E): ApiClient[E] {
	const url = `${PFORGE_BASE}${route}`
	return (async () => {
		const res = await fetch(url)
		if (!res.ok) {
			throw new Error(`API error: ${res.status}`)
		}
		return await res.json()
	}) as ApiClient[E]
}

export const pforgeApi: ApiClient = {
	'/issues': useApiGetter('/issues')
}
