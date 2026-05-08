import { readFile, writeFile, mkdir, unlink } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import type { InitState } from '$lib/types.js';

const PFORGE_DIR = '.pforge';
const STATE_TTL_MS = 60 * 60 * 1000;

export function generateState(): string {
	return randomBytes(16).toString('hex');
}

export async function readStateFile(state: string): Promise<InitState | null> {
	const path = `${PFORGE_DIR}/init-state-${state}.json`;
	if (!existsSync(path)) return null;
	try {
		const content = await readFile(path, 'utf-8');
		const data = JSON.parse(content) as InitState;
		if (Date.now() - data.createdAt > STATE_TTL_MS) {
			await unlink(path).catch(() => {});
			return null;
		}
		return data;
	} catch {
		return null;
	}
}

export async function writeStateFile(state: InitState) {
	await mkdir(PFORGE_DIR, { recursive: true });
	await writeFile(`${PFORGE_DIR}/init-state-${state.state}.json`, JSON.stringify(state), 'utf-8');
}

export async function deleteStateFile(state: string) {
	const path = `${PFORGE_DIR}/init-state-${state}.json`;
	if (existsSync(path)) {
		await unlink(path).catch(() => {});
	}
}
