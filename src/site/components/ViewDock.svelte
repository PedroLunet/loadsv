<!--
	Switches between the three ways to see the library. The highlight slides to the chosen
	view; until the page hydrates, the active link paints it itself so nothing jumps.
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	const views = [
		{ href: resolve('/'), label: 'Try it' },
		{ href: resolve('/browse'), label: 'Browse' },
		{ href: resolve('/in-an-app'), label: 'In an app' }
	];

	const links: HTMLAnchorElement[] = $state([]);
	const current = $derived(views.findIndex((view) => view.href === page.url.pathname));

	let highlight = $state<{ x: number; width: number }>();
	let slide = $state(false);

	$effect(() => {
		const link = links[current];
		if (link) highlight = { x: link.offsetLeft, width: link.offsetWidth };
	});

	// Slide between views, but never into the starting position.
	onMount(() => requestAnimationFrame(() => requestAnimationFrame(() => (slide = true))));
</script>

<!-- Sticky, not fixed: at the end of the page it rests in its own space above the footer. -->
<div class="pointer-events-none sticky bottom-0 z-30 flex justify-center px-4 pb-4">
	<nav
		aria-label="Views"
		class="pointer-events-auto relative flex rounded-full bg-white/80 p-1 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.16),0_1px_2px_rgba(0,0,0,0.05)] ring-1 ring-neutral-900/[0.07] backdrop-blur-md"
	>
		{#if highlight}
			<span
				aria-hidden="true"
				class={[
					'absolute top-1 bottom-1 left-0 rounded-full bg-neutral-100',
					slide &&
						'transition-[translate,width] duration-250 ease-out motion-reduce:transition-none'
				]}
				style:translate="{highlight.x}px 0"
				style:width="{highlight.width}px"
			></span>
		{/if}
		{#each views as view, i (view.href)}
			{@const active = i === current}
			<a
				bind:this={links[i]}
				href={view.href}
				aria-current={active ? 'page' : undefined}
				class={[
					'relative flex h-8 items-center rounded-full px-3.5 text-[13px] transition-[color,scale] duration-150 ease-out active:scale-[0.97]',
					active ? 'text-neutral-950' : 'text-neutral-500 hover:text-neutral-900',
					active && !highlight && 'bg-neutral-100'
				]}>{view.label}</a
			>
		{/each}
	</nav>
</div>
