export type HybridDataState<T> = {
	data: T | undefined
	loading: boolean
	error: string | null
	reload: () => void
}

export function useHybridData<T>(
	prop: () => T | undefined,
	loader: () => Promise<T>
): HybridDataState<T> {
	let data = $state<T | undefined>(prop())
	let loading = $state(prop() === undefined)
	let error = $state<string | null>(null)

	async function load() {
		loading = true
		error = null
		try {
			data = await loader()
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load data'
		} finally {
			loading = false
		}
	}

	$effect(() => {
		const currentProp = prop()
		if (currentProp !== undefined) {
			data = currentProp
			loading = false
			error = null
		} else {
			load()
		}
	})

	return {
		get data() {
			return data
		},
		get loading() {
			return loading
		},
		get error() {
			return error
		},
		reload: load
	}
}
