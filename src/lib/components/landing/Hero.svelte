<script lang="ts">
	function scrollToDemo() {
		document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<section
	class="relative flex flex-col items-center justify-center px-6 pt-20 pb-12 md:pt-28 md:pb-20 text-center overflow-hidden"
>
	<!-- Abstract decorative SVG -->
	<div class="absolute inset-0 pointer-events-none opacity-[0.06]" aria-hidden="true">
		<svg
			class="w-full h-full"
			viewBox="0 0 800 400"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			preserveAspectRatio="xMidYMid slice"
		>
			<path
				d="M50 200 Q200 100 350 200 T650 200"
				stroke="currentColor"
				stroke-width="2"
				fill="none"
				class="text-primary"
			/>
			<circle cx="50" cy="200" r="6" fill="currentColor" class="text-primary" />
			<circle cx="200" cy="150" r="6" fill="currentColor" class="text-primary" />
			<circle cx="350" cy="200" r="6" fill="currentColor" class="text-primary" />
			<circle cx="500" cy="170" r="6" fill="currentColor" class="text-primary" />
			<circle cx="650" cy="200" r="6" fill="currentColor" class="text-primary" />
			<path
				d="M100 300 Q250 220 400 300 T700 300"
				stroke="currentColor"
				stroke-width="1.5"
				fill="none"
				class="text-primary"
				opacity="0.5"
			/>
			<circle cx="100" cy="300" r="4" fill="currentColor" class="text-primary" opacity="0.5" />
			<circle cx="250" cy="260" r="4" fill="currentColor" class="text-primary" opacity="0.5" />
			<circle cx="400" cy="300" r="4" fill="currentColor" class="text-primary" opacity="0.5" />
			<circle cx="550" cy="280" r="4" fill="currentColor" class="text-primary" opacity="0.5" />
			<circle cx="700" cy="300" r="4" fill="currentColor" class="text-primary" opacity="0.5" />
		</svg>
	</div>

	<div class="relative max-w-3xl mx-auto">
		<h1 class="text-4xl md:text-6xl font-bold tracking-tight text-ink leading-[1.1] mb-6">
			Turn your GitHub into a
			<span class="text-primary">public roadmap</span>
		</h1>

		<p class="text-lg md:text-xl text-ink-secondary max-w-xl mx-auto mb-10 leading-relaxed">
			Zero database. One command. Your users finally understand what's shipping.
		</p>

		<div class="flex flex-col sm:flex-row items-center justify-center gap-4">
			<button
				onclick={scrollToDemo}
				class="inline-flex items-center justify-center px-7 py-3.5 bg-primary text-white font-medium rounded-md hover:bg-primary-hover transition-colors duration-200 cursor-pointer"
			>
				See it live
				<svg
					class="ml-2 w-4 h-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</button>

			<a
				href="https://github.com/your-org/pforge"
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center justify-center px-7 py-3.5 bg-clay text-ink font-medium rounded-md hover:bg-clay-border transition-colors duration-200"
			>
				Read the docs
			</a>
		</div>
	</div>
</section>
