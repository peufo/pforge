import { describe, it, expect } from 'vitest'
import { buildManifest } from './github-app-manifest.js'

describe('buildManifest', () => {
	it('returns a manifest with the correct app name', () => {
		const manifest = buildManifest({
			name: 'pforge-myrepo',
			owner: 'my-org',
			repo: 'myrepo',
			redirectUrl: 'http://localhost:3456/callback'
		})

		expect(manifest.name).toBe('pforge-myrepo')
	})

	it('includes write permission for issues', () => {
		const manifest = buildManifest({
			name: 'pforge-test',
			owner: 'test-org',
			repo: 'test-repo',
			redirectUrl: 'http://localhost:3000/callback'
		})

		expect(manifest.default_permissions).toEqual({
			issues: 'write',
			discussions: 'read'
		})
	})

	it('subscribes to issues and issue_comment events', () => {
		const manifest = buildManifest({
			name: 'pforge-test',
			owner: 'test-org',
			repo: 'test-repo',
			redirectUrl: 'http://localhost:3000/callback'
		})

		expect(manifest.default_events).toEqual(['issues', 'issue_comment'])
	})

	it('sets the redirect and callback URLs', () => {
		const redirectUrl = 'http://localhost:4000/callback'
		const manifest = buildManifest({
			name: 'pforge-test',
			owner: 'test-org',
			repo: 'test-repo',
			redirectUrl
		})

		expect(manifest.redirect_url).toBe(redirectUrl)
		expect(manifest.callback_urls).toEqual([redirectUrl])
		expect(manifest.hook_attributes).toEqual({ url: redirectUrl })
	})
})
