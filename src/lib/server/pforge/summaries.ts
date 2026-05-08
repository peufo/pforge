import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import type { PForgeSummary } from '$lib/types.js';

const SUMMARIES_PATH = 'data/summaries.json';

export async function readSummaries(): Promise<PForgeSummary[]> {
	if (!existsSync(SUMMARIES_PATH)) return [];
	try {
		const content = await readFile(SUMMARIES_PATH, 'utf-8');
		return JSON.parse(content) as PForgeSummary[];
	} catch {
		return [];
	}
}

export async function writeSummaries(summaries: PForgeSummary[]) {
	await mkdir('data', { recursive: true });
	await writeFile(SUMMARIES_PATH, JSON.stringify(summaries, null, '\t') + '\n', 'utf-8');
}
