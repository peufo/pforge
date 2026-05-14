import type { PForgeServerAPI } from '$lib/server/api'
import { PFORGE_BASE } from './constant'

type EndpointPath = keyof PForgeServerAPI

type EndpointParams<E extends EndpointPath> = PForgeServerAPI[E]['params']
type EndpointResponse<E extends EndpointPath> = PForgeServerAPI[E]['response']

type ApiClient = {
	[E in EndpointPath]: (params?: EndpointParams<E>) => Promise<EndpointResponse<E>>
}

function useApiGetter<E extends EndpointPath>(route: E): ApiClient[E] {
	return (async (params?: EndpointParams<E>) => {
		const search = params
			? '?' +
				new URLSearchParams(
					Object.entries(params)
						.filter(([, v]) => v !== undefined)
						.map(([k, v]) => [k, String(v)])
				).toString()
			: ''
		const res = await fetch(`${PFORGE_BASE}${route}${search}`)
		if (!res.ok) {
			throw new Error(`API error: ${res.status}`)
		}
		return await res.json()
	}) as ApiClient[E]
}

export const pforgeApi: ApiClient = {
	'/issues': useApiGetter('/issues')
}
