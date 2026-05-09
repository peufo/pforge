import { PFORGE_BASE } from '$lib/constant'
import { json, type RequestEvent } from '@sveltejs/kit'
import { getGithubIssues } from './github/issues'

type RouteHandler = (event: RequestEvent) => Promise<Response>

export async function pforgeHandler(event: RequestEvent): Promise<Response | null> {
	const pathname = event.url.pathname
	const method = event.request.method
	if (!pathname.startsWith(PFORGE_BASE)) return null
	const handlerName = pathname.replace(PFORGE_BASE, '')
	const handler = (handlers as Handlers)[handlerName]?.[method]
	return handler?.(event) || null
}

type Handlers = Record<string, Partial<Record<string, RouteHandler>>>

const handlers = {
	'/issues': {
		get: handleGetIssues
	}
} satisfies Handlers

async function handleGetIssues(event: RequestEvent): Promise<Response> {
	const issues = await getGithubIssues()
	return json(issues)
}
