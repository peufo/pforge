import { pforgeAdminHandler } from '$lib/server/pforge/handler.js';

export const handle = async ({ event, resolve }) => {
	const response = await pforgeAdminHandler(event);
	if (response) return response;
	return await resolve(event);
};
