import type { PForgeServerAPI } from '$lib/server/api'
import { PFORGE_BASE } from './constant'

type EndpointPath = keyof PForgeServerAPI
type PForgeApi = { [E in EndpointPath]: () => ReturnType<PForgeServerAPI[E]['get']> }

export const pforgeApi: PForgeApi = {
	'/issues': useApiGetter('/issues')
}

function useApiGetter(route: EndpointPath) {
	const url = `${PFORGE_BASE}${route}`
	return async () => {
		// TODO: Standard error handling

		const res = await fetch(url)
		const json = res.json()
		return json
	}
}
