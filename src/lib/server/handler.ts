import { readSummaries, writeSummaries } from './summaries.js'
import { jsonResponse } from './response.js'
import { PFORGE_BASE } from '$lib/constant'
import type { RequestEvent } from '@sveltejs/kit'
import type { PForgeSummary } from '$lib/types'

type RouteHandler = (event: RequestEvent) => Promise<Response>

function matchRoute(event: RequestEvent): RouteHandler | null {
	const pathname = event.url.pathname
	const method = event.request.method
	if (!pathname.startsWith(PFORGE_BASE)) return null

	if (pathname === `${PFORGE_BASE}/summaries` && method === 'GET') return handleGetSummaries
	if (pathname === `${PFORGE_BASE}/summaries` && method === 'POST') return handleCreateSummary
	if (pathname.startsWith(`${PFORGE_BASE}/summaries/`) && method === 'PUT')
		return handleUpdateSummary

	return null
}

export async function pforgeHandler(event: RequestEvent): Promise<Response | null> {
	const handler = matchRoute(event)
	return handler ? handler(event) : null
}

async function handleGetSummaries(): Promise<Response> {
	return jsonResponse(await readSummaries())
}

async function handleCreateSummary(event: RequestEvent): Promise<Response> {
	const body = (await event.request.json()) as {
		periodStart: string
		periodEnd: string
		title: string
		body: string
	}
	const summaries = await readSummaries()
	const newSummary: PForgeSummary = {
		id: crypto.randomUUID(),
		periodStart: body.periodStart,
		periodEnd: body.periodEnd,
		title: body.title,
		body: body.body,
		sources: [],
		generatedAt: new Date().toISOString()
	}
	summaries.push(newSummary)
	await writeSummaries(summaries)
	return jsonResponse(newSummary, 201)
}

async function handleUpdateSummary(event: RequestEvent): Promise<Response> {
	const id = event.url.pathname.slice(`${PFORGE_BASE}/summaries/`.length)
	const body = (await event.request.json()) as { title?: string; body?: string }
	const summaries = await readSummaries()
	const index = summaries.findIndex((s) => s.id === id)
	if (index === -1) {
		return jsonResponse({ error: 'Summary not found' }, 404)
	}
	if (body.title !== undefined) summaries[index].title = body.title
	if (body.body !== undefined) summaries[index].body = body.body
	await writeSummaries(summaries)
	return jsonResponse(summaries[index])
}
