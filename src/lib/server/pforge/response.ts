export function jsonResponse(data: unknown, status = 200): Response {
	return new Response(JSON.stringify(data), {
		status,
		headers: { 'Content-Type': 'application/json' }
	});
}

export function htmlResponse(html: string, status = 200): Response {
	return new Response(html, {
		status,
		headers: { 'Content-Type': 'text/html' }
	});
}

export function buildInitFormHtml(manifest: Record<string, unknown>, state: string): string {
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
const stateInput = document.createElement('input');
stateInput.type = 'hidden';
stateInput.name = 'state';
stateInput.value = ${JSON.stringify(state)};
document.getElementById('f').appendChild(stateInput);
document.getElementById('f').submit();
</script>
</body>
</html>`;
}

export function buildSuccessHtml(credentials: { name: string; id: number }): string {
	return `<!DOCTYPE html>
<html><body>
<h1>✅ GitHub App created!</h1>
<p>App <strong>${credentials.name}</strong> has been created.</p>
<p>ID: ${credentials.id}</p>
<p>Credentials have been saved to <code>.env</code>.</p>
<p><strong>Please restart your server to apply changes.</strong></p>
<p><a href="/">Go to admin</a></p>
</body></html>`;
}
