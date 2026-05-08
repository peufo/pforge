import { buildManifest, exchangeCodeForCredentials } from '../github-app-manifest.js';
import { readEnv, writeEnv } from './env.js';
import { generateState, readStateFile, writeStateFile, deleteStateFile } from './state.js';
import { readSummaries, writeSummaries } from './summaries.js';
import { jsonResponse, htmlResponse, buildInitFormHtml, buildSuccessHtml } from './response.js';
import { PFORGE_BASE } from '$lib/constant.js';
import type { RequestEvent } from '@sveltejs/kit';
import type { PForgeSummary } from '$lib/types.js';

type RouteHandler = (event: RequestEvent) => Promise<Response>;

function matchRoute(event: RequestEvent): RouteHandler | null {
	const pathname = event.url.pathname;
	const method = event.request.method;
	if (!pathname.startsWith(PFORGE_BASE)) return null;

	if (pathname === `${PFORGE_BASE}/init` && method === 'POST') return handleInit;
	if (pathname === `${PFORGE_BASE}/init/callback` && method === 'GET') return handleCallback;
	if (pathname === `${PFORGE_BASE}/status` && method === 'GET') return handleStatus;
	if (pathname === `${PFORGE_BASE}/summaries` && method === 'GET') return handleGetSummaries;
	if (pathname === `${PFORGE_BASE}/summaries` && method === 'POST') return handleCreateSummary;
	if (pathname.startsWith(`${PFORGE_BASE}/summaries/`) && method === 'PUT')
		return handleUpdateSummary;

	return null;
}

export async function pforgeAdminHandler(event: RequestEvent): Promise<Response | null> {
	const handler = matchRoute(event);
	return handler ? handler(event) : null;
}

// --- route handlers ---

async function handleInit(event: RequestEvent): Promise<Response> {
	const body = (await event.request.json()) as { repo: string; name: string };
	const { repo, name } = body;
	if (!repo || !repo.includes('/') || !name) {
		return jsonResponse({ error: 'Missing repo (format: owner/repo) or name' }, 400);
	}
	const [owner, repoName] = repo.split('/');
	if (!owner || !repoName) {
		return jsonResponse({ error: 'Repo must be in format owner/repo' }, 400);
	}

	const state = generateState();
	const redirectUrl = `${event.url.origin}${PFORGE_BASE}/init/callback`;
	const manifest = buildManifest({ name, owner, repo: repoName, redirectUrl });

	await writeStateFile({ state, owner, repo: repoName, name, createdAt: Date.now() });

	return htmlResponse(buildInitFormHtml(manifest, state));
}

async function handleCallback(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');

	if (!code || !state) {
		return htmlResponse('<h1>❌ Missing code or state</h1>', 400);
	}

	const initState = await readStateFile(state);
	if (!initState) {
		return htmlResponse('<h1>❌ State expired or invalid</h1>', 400);
	}

	await deleteStateFile(state);

	try {
		const credentials = await exchangeCodeForCredentials(code);
		await writeEnv({
			GITHUB_APP_ID: String(credentials.id),
			GITHUB_PRIVATE_KEY: credentials.pem,
			...(credentials.webhook_secret ? { GITHUB_WEBHOOK_SECRET: credentials.webhook_secret } : {})
		});
		return htmlResponse(buildSuccessHtml(credentials));
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		return htmlResponse(`<h1>❌ Error</h1><p>${message}</p>`, 500);
	}
}

async function handleStatus(): Promise<Response> {
	const env = await readEnv();
	const appId = env.GITHUB_APP_ID;
	return jsonResponse({
		connected: !!appId,
		appId
	});
}

async function handleGetSummaries(): Promise<Response> {
	return jsonResponse(await readSummaries());
}

async function handleCreateSummary(event: RequestEvent): Promise<Response> {
	const body = (await event.request.json()) as {
		periodStart: string;
		periodEnd: string;
		title: string;
		body: string;
	};
	const summaries = await readSummaries();
	const newSummary: PForgeSummary = {
		id: crypto.randomUUID(),
		periodStart: body.periodStart,
		periodEnd: body.periodEnd,
		title: body.title,
		body: body.body,
		sources: [],
		generatedAt: new Date().toISOString()
	};
	summaries.push(newSummary);
	await writeSummaries(summaries);
	return jsonResponse(newSummary, 201);
}

async function handleUpdateSummary(event: RequestEvent): Promise<Response> {
	const id = event.url.pathname.slice(`${PFORGE_BASE}/summaries/`.length);
	const body = (await event.request.json()) as { title?: string; body?: string };
	const summaries = await readSummaries();
	const index = summaries.findIndex((s) => s.id === id);
	if (index === -1) {
		return jsonResponse({ error: 'Summary not found' }, 404);
	}
	if (body.title !== undefined) summaries[index].title = body.title;
	if (body.body !== undefined) summaries[index].body = body.body;
	await writeSummaries(summaries);
	return jsonResponse(summaries[index]);
}
