#!/usr/bin/env node

import { createServer } from 'node:http';
import { exec } from 'node:child_process';
import { writeFile, rename } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { intro, outro, text, spinner, cancel, isCancel } from '@clack/prompts';
import { buildManifest, exchangeCodeForCredentials } from '../server/github-app-manifest.ts';

async function findFreePort(start = 3456): Promise<number> {
	return new Promise((resolve, reject) => {
		const server = createServer();
		server.listen(start, () => {
			const port = (server.address() as { port: number }).port;
			server.close(() => resolve(port));
		});
		server.on('error', () => {
			findFreePort(start + 1).then(resolve, reject);
		});
	});
}

function openBrowser(url: string) {
	const command =
		process.platform === 'darwin'
			? `open "${url}"`
			: process.platform === 'win32'
				? `start "${url}"`
				: `xdg-open "${url}"`;
	exec(command, () => {
		/* ignore errors */
	});
}

function buildFormHtml(manifest: Record<string, unknown>): string {
	const manifestJson = JSON.stringify(manifest);
	return `<!DOCTYPE html>
<html>
<head><title>pforge-init</title></head>
<body>
<p>Redirecting to GitHub...</p>
<form action="https://github.com/settings/apps/new" method="POST" id="f"></form>
<script>
const input = document.createElement('input');
input.type = 'hidden';
input.name = 'manifest';
input.value = ${JSON.stringify(manifestJson)};
document.getElementById('f').appendChild(input);
document.getElementById('f').submit();
</script>
</body>
</html>`;
}

async function writeEnv(credentials: { id: number; pem: string; webhook_secret: string | null }) {
	const lines: string[] = [];
	lines.push(`GITHUB_APP_ID=${credentials.id}`);
	lines.push(`GITHUB_PRIVATE_KEY="${credentials.pem.replace(/\n/g, '\\n')}"`);
	if (credentials.webhook_secret) {
		lines.push(`GITHUB_WEBHOOK_SECRET="${credentials.webhook_secret}"`);
	}
	lines.push('');

	const content = lines.join('\n');

	if (existsSync('.env')) {
		const backup = `.env.backup.${Date.now()}`;
		await rename('.env', backup);
		console.log(`  💾  Existing .env backed up to ${backup}`);
	}

	await writeFile('.env', content, 'utf-8');
	console.log('  📄  Credentials written to .env');
}

async function runServer(port: number, manifest: Record<string, unknown>): Promise<string> {
	return new Promise((resolve, reject) => {
		const timeout = setTimeout(
			() => {
				server.close();
				reject(new Error('Timeout: no response from GitHub within 5 minutes'));
			},
			5 * 60 * 1000
		);

		const server = createServer((req, res) => {
			const url = new URL(req.url || '/', `http://localhost:${port}`);

			if (url.pathname === '/callback') {
				const code = url.searchParams.get('code');
				if (code) {
					clearTimeout(timeout);
					res.writeHead(200, { 'Content-Type': 'text/html' });
					res.end(`<!DOCTYPE html>
<html><body>
<h2>✅ GitHub App created!</h2>
<p>You can close this tab and return to your terminal.</p>
</body></html>`);
					server.close(() => resolve(code));
					return;
				}
				res.writeHead(400);
				res.end('Missing code');
				return;
			}

			res.writeHead(200, { 'Content-Type': 'text/html' });
			res.end(buildFormHtml(manifest));
		});

		server.listen(port, () => {
			/* server is ready */
		});

		server.on('error', (err) => {
			clearTimeout(timeout);
			reject(err);
		});
	});
}

async function main() {
	intro('🔨  pforge-init');

	const owner = await text({
		message: 'GitHub owner or organization',
		placeholder: 'e.g. acme-corp',
		validate(value) {
			if (!value) return 'Owner is required';
		}
	});
	if (isCancel(owner)) {
		cancel('Cancelled');
		process.exit(0);
	}

	const repo = await text({
		message: 'Repository name',
		placeholder: 'e.g. my-project',
		validate(value) {
			if (!value) return 'Repository name is required';
		}
	});
	if (isCancel(repo)) {
		cancel('Cancelled');
		process.exit(0);
	}

	const name = await text({
		message: 'App name',
		placeholder: `pforge-${repo}`,
		initialValue: `pforge-${repo}`
	});
	if (isCancel(name)) {
		cancel('Cancelled');
		process.exit(0);
	}

	const port = await findFreePort();
	const redirectUrl = `http://localhost:${port}/callback`;
	const manifest = buildManifest({ name, owner, repo, redirectUrl });

	const s = spinner();
	s.start('Starting local server');

	const codePromise = runServer(port, manifest);

	s.stop(`Local server running on http://localhost:${port}`);

	openBrowser(`http://localhost:${port}/`);

	const s2 = spinner();
	s2.start('Waiting for GitHub callback...');

	const code = await codePromise;

	s2.stop('GitHub app created');

	const s3 = spinner();
	s3.start('Exchanging code for credentials');

	const credentials = await exchangeCodeForCredentials(code);

	s3.stop('Credentials received');

	console.log();
	console.log(`  ✅  App "${credentials.name}" created successfully!`);
	console.log(`     ID: ${credentials.id}`);
	console.log(`     URL: ${credentials.html_url}`);
	console.log();

	await writeEnv(credentials);

	outro(
		`⚠️  Next step: install the app on your repository\n   ${credentials.html_url}/installations`
	);
}

main().catch((err) => {
	console.error('Error:', err.message);
	process.exit(1);
});
