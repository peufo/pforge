import { pforgeHandler } from '$lib/server/handler'

export const handle = async ({ event, resolve }) => {
	const response = await pforgeHandler(event)
	if (response) return response
	return await resolve(event)
}
