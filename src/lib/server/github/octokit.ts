import { App, Octokit } from 'octokit'
import { getGithubEnv } from './env'

export async function getInstallationOctokit(): Promise<Octokit> {
	const { appId, privateKey, owner } = getGithubEnv()

	const app = new App({ appId, privateKey })

	const { data: installations } = await app.octokit.rest.apps.listInstallations()
	const installation = installations.find(
		(i) => i.account && 'login' in i.account && i.account.login === owner
	)

	if (!installation) {
		throw new Error(`No GitHub App installation found for owner: ${owner}`)
	}

	return app.getInstallationOctokit(installation.id)
}
