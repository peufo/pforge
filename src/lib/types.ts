export type PForgeSummary = {
	id: string
	periodStart: string
	periodEnd: string
	title: string
	body: string
	sources: string[]
	generatedAt: string
}

export type PForgeStatus = {
	connected: boolean
	owner?: string
	repo?: string
	appId?: string
}

export type InitState = {
	state: string
	owner: string
	repo: string
	name: string
	createdAt: number
}
