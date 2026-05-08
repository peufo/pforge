<script lang="ts">
	type Status = 'shipped' | 'in-progress' | 'planned';

	type Item = {
		id: number;
		title: string;
		desc: string;
		status: Status;
		upvotes: number;
		comments: number;
		date: string;
	};

	type StatusConfig = {
		label: string;
		bg: string;
		text: string;
		dot: string;
	};

	let view = $state('timeline');

	const items: Item[] = [
		{
			id: 1,
			title: 'Dark mode support',
			desc: 'Automatic theme switching based on system preference, with manual override.',
			status: 'shipped',
			upvotes: 42,
			comments: 7,
			date: 'Jan 2025'
		},
		{
			id: 2,
			title: 'Kanban board view',
			desc: 'Switch between timeline and kanban layouts for your roadmap.',
			status: 'in-progress',
			upvotes: 38,
			comments: 12,
			date: 'Feb 2025'
		},
		{
			id: 3,
			title: 'Anonymous commenting',
			desc: 'Let users leave feedback without creating a GitHub account.',
			status: 'in-progress',
			upvotes: 55,
			comments: 23,
			date: 'Mar 2025'
		},
		{
			id: 4,
			title: 'Multi-repo support',
			desc: 'Aggregate issues and releases across multiple repositories.',
			status: 'planned',
			upvotes: 19,
			comments: 4,
			date: 'Q2 2025'
		},
		{
			id: 5,
			title: 'Email notifications',
			desc: 'Get notified when a feature you upvoted changes status.',
			status: 'planned',
			upvotes: 31,
			comments: 9,
			date: 'Q3 2025'
		}
	];

	const statusConfig: Record<Status, StatusConfig> = {
		shipped: { label: 'Shipped', bg: 'bg-primary-subtle', text: 'text-primary', dot: 'bg-primary' },
		'in-progress': {
			label: 'In Progress',
			bg: 'bg-amber-100',
			text: 'text-amber-800',
			dot: 'bg-amber-600'
		},
		planned: { label: 'Planned', bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' }
	};

	function groupedByStatus(): Record<Status, Item[]> {
		const groups: Record<Status, Item[]> = { planned: [], 'in-progress': [], shipped: [] };
		for (const item of items) groups[item.status].push(item);
		return groups;
	}
</script>

<section id="demo" class="px-6 py-16 md:py-24 bg-paper-deep">
	<div class="max-w-5xl mx-auto">
		<div class="flex items-center justify-between mb-8">
			<h2 class="text-2xl md:text-3xl font-semibold text-ink">Roadmap</h2>

			<div class="flex bg-clay rounded-md p-1">
				<button
					class="px-4 py-1.5 text-sm font-medium rounded-sm transition-all cursor-pointer {view ===
					'timeline'
						? 'bg-white text-ink shadow-sm'
						: 'text-ink-muted hover:text-ink-secondary'}"
					onclick={() => (view = 'timeline')}
				>
					Timeline
				</button>
				<button
					class="px-4 py-1.5 text-sm font-medium rounded-sm transition-all cursor-pointer {view ===
					'kanban'
						? 'bg-white text-ink shadow-sm'
						: 'text-ink-muted hover:text-ink-secondary'}"
					onclick={() => (view = 'kanban')}
				>
					Kanban
				</button>
			</div>
		</div>

		<div class="bg-white rounded-lg border border-clay-border overflow-hidden">
			{#if view === 'timeline'}
				<div class="divide-y divide-clay-border">
					{#each items as item (item.id)}
						<div class="p-5 hover:bg-paper transition-colors">
							<div class="flex items-start gap-4">
								<div class="flex-shrink-0 mt-1">
									<span
										class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium {statusConfig[
											item.status
										].bg} {statusConfig[item.status].text}"
									>
										<span class="w-1.5 h-1.5 rounded-full {statusConfig[item.status].dot}"></span>
										{statusConfig[item.status].label}
									</span>
								</div>
								<div class="flex-1 min-w-0">
									<h3 class="font-semibold text-ink mb-1">{item.title}</h3>
									<p class="text-sm text-ink-secondary leading-relaxed mb-3">{item.desc}</p>
									<div class="flex items-center gap-5 text-sm text-ink-muted">
										<span class="inline-flex items-center gap-1.5">
											<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
												><path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M5 10l7-7m0 0l7 7m-7-7v18"
												/></svg
											>
											{item.upvotes}
										</span>
										<span class="inline-flex items-center gap-1.5">
											<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
												><path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.013 8.013 0 01-5.45-2.125L3 21l1.125-4.55A8.013 8.013 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"
												/></svg
											>
											{item.comments}
										</span>
										<span class="text-ink-muted/60">{item.date}</span>
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
					{#each Object.entries(groupedByStatus()) as [status, groupItems] (status)}
						{@const cfg = statusConfig[status as Status]}
						<div>
							<div class="flex items-center gap-2 mb-4">
								<span class="w-2 h-2 rounded-full {cfg.dot}"></span>
								<span class="text-sm font-semibold {cfg.text}">{cfg.label}</span>
								<span class="text-xs text-ink-muted bg-clay px-2 py-0.5 rounded-full"
									>{groupItems.length}</span
								>
							</div>
							<div class="space-y-3">
								{#each groupItems as item (item.id)}
									<div
										class="bg-paper rounded-md p-4 border border-clay-border hover:border-clay transition-colors"
									>
										<h3 class="font-medium text-ink text-sm mb-1">{item.title}</h3>
										<p class="text-xs text-ink-secondary leading-relaxed mb-3">{item.desc}</p>
										<div class="flex items-center gap-4 text-xs text-ink-muted">
											<span class="inline-flex items-center gap-1">
												<svg
													class="w-3.5 h-3.5"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
													><path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M5 10l7-7m0 0l7 7m-7-7v18"
													/></svg
												>
												{item.upvotes}
											</span>
											<span class="inline-flex items-center gap-1">
												<svg
													class="w-3.5 h-3.5"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
													><path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.013 8.013 0 01-5.45-2.125L3 21l1.125-4.55A8.013 8.013 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"
													/></svg
												>
												{item.comments}
											</span>
										</div>
									</div>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<p class="text-center text-sm text-ink-muted mt-6">
			This roadmap is powered by <span class="font-medium text-ink-secondary">pforge</span> — try upvoting
			or switching views above.
		</p>
	</div>
</section>
