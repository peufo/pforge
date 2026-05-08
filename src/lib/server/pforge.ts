type PForgeOptions = {
	github: {
		repo: string;
		appId: string;
		privateKey: string;
	};
	llm?: {
		provider: string;
		apiKey: string;
		model: string;
		summariesPath: string;
	};
};

export async function usePForge(options: PForgeOptions) {
	// TODO: Test de la connection au repo

	async function getIssues() {
		// TODO: fetch somme issues
	}

	return {
		getIssues
	};
}
