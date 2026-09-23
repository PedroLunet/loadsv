<script lang="ts">
	let { items }: { items: { id: string; title: string }[] } = $props();

	/** Distance from the top of the viewport at which a section counts as the current one. */
	const OFFSET = 120;

	let active = $state<string>();

	$effect(() => {
		let frame = 0;

		const update = () => {
			frame = 0;
			let current: string | undefined = items[0]?.id;
			for (const { id } of items) {
				const top = document.getElementById(id)?.getBoundingClientRect().top;
				if (top !== undefined && top < OFFSET) current = id;
			}
			// Short final sections can never reach the top; at the bottom of the page, the last one wins.
			const { scrollHeight } = document.documentElement;
			if (innerHeight + scrollY >= scrollHeight - 2) current = items.at(-1)?.id;
			active = current;
		};

		const schedule = () => {
			if (!frame) frame = requestAnimationFrame(update);
		};

		update();
		addEventListener('scroll', schedule, { passive: true });
		addEventListener('resize', schedule, { passive: true });
		return () => {
			removeEventListener('scroll', schedule);
			removeEventListener('resize', schedule);
			cancelAnimationFrame(frame);
		};
	});
</script>

<nav aria-label="On this page" class="text-[13px]">
	<ul>
		{#each items as item (item.id)}
			<li>
				<a
					href="#{item.id}"
					aria-current={active === item.id ? 'location' : undefined}
					class="block rounded-md px-2 py-1 text-neutral-500 transition-colors duration-150 hover:text-neutral-950 aria-[current=location]:bg-neutral-100 aria-[current=location]:text-neutral-950"
				>
					{item.title}
				</a>
			</li>
		{/each}
	</ul>
</nav>
