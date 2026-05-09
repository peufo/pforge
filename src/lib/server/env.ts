import { readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'

const ENV_PATH = '.env'

export async function readEnv(): Promise<Record<string, string>> {
	if (!existsSync(ENV_PATH)) return {}
	const content = await readFile(ENV_PATH, 'utf-8')
	const env: Record<string, string> = {}
	for (const line of content.split('\n')) {
		const trimmed = line.trim()
		if (!trimmed || trimmed.startsWith('#')) continue
		const eq = trimmed.indexOf('=')
		if (eq === -1) continue
		const key = trimmed.slice(0, eq).trim()
		let value = trimmed.slice(eq + 1).trim()
		if (value.startsWith('"') && value.endsWith('"')) {
			value = value.slice(1, -1).replace(/\\n/g, '\n')
		}
		env[key] = value
	}
	return env
}

export async function writeEnv(updates: Record<string, string>) {
	const env = await readEnv()
	Object.assign(env, updates)
	const lines = Object.entries(env).map(([k, v]) => {
		if (v.includes('\n')) {
			return `${k}="${v.replace(/\n/g, '\\n')}"`
		}
		return `${k}=${v}`
	})
	await writeFile(ENV_PATH, lines.join('\n') + '\n', 'utf-8')
}
