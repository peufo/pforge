export type GithubIssue = {
	id: number
	number: number
	title: string
	body: string | null
	state: 'open' | 'closed'
	html_url: string
	created_at: string
	updated_at: string
	labels: Array<{ name: string; color: string }>
	user: { login: string; avatar_url: string } | null
}

export type GetIssuesParams = {
	state?: 'open' | 'closed' | 'all'
}
