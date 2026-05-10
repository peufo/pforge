import { pforgeServerApi } from '$lib/server/api'

export const handle = async ({ event, resolve }) => {
	const response = await pforgeServerApi(event)
	if (response) return response
	return await resolve(event)
}
