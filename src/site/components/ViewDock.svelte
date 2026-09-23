<!--
	Switches between the three ways to see the library. The chosen view is a dark thumb:
	a white copy of the labels on black, clipped to that view. Moving the clip slides the
	thumb, and every label keeps the right colour mid-slide. Until the page hydrates, the
	active link paints the thumb itself so nothing jumps.
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	// Matched by route, not href: prerendered hrefs are relative, so they never equal the URL.
	const views = [
		{ route: '/(views)', href: resolve('/'), label: 'Try it' },
		{ route: '/(views)/browse', href: resolve('/browse'), label: 'Browse' },
		{ route: '/(views)/in-an-app', href: resolve('/in-an-app'), label: 'In an app' }
	] as const;

	// Both layers share these so their labels line up exactly.
	const label = 'flex h-8 items-center rounded-full px-3.5 text-[13px] font-medium';

	const links: HTMLAnchorElement[] = $state([]);
	const current = $derived(views.findIndex((view) => view.route === page.route.id));

	let clip = $state<string>();
	let slide = $state(false);

	$effect(() => {
		const link = links[current];
		const nav = link?.offsetParent;
		if (!link || !nav) return;
		const top = link.offsetTop;
		const left = link.offsetLeft;
		const right = nav.clientWidth - left - link.offsetWidth;
		const bottom = nav.clientHeight - top - link.offsetHeight;
		clip = `inset(${top}px ${right}px ${bottom}px ${left}px round 999px)`;
	});

	// Slide between views, but never into the starting position.
	onMount(() => requestAnimationFrame(() => requestAnimationFrame(() => (slide = true))));
</script>

<!-- Sticky, not fixed: at the end of the page it rests in its own space above the footer. -->
<div class="pointer-events-none sticky bottom-0 z-30 flex justify-center px-4 pb-4">
	<nav
		aria-label="Views"
		class="pointer-events-auto relative flex rounded-full bg-white/85 p-1 shadow-[0_12px_32px_-10px_rgba(0,0,0,0.28),0_2px_6px_-1px_rgba(0,0,0,0.08)] ring-1 ring-neutral-900/10 backdrop-blur-md"
	>
		{#each views as view, i (view.href)}
			{@const active = i === current}
			<a
				bind:this={links[i]}
				href={view.href}
				aria-current={active ? 'page' : undefined}
				class={[
					'relative transition-[color,scale] duration-150 ease-out active:scale-[0.97]',
					label,
					active && !clip ? 'bg-neutral-950 text-white' : 'text-neutral-600 hover:text-neutral-950'
				]}>{view.label}</a
			>
		{/each}
		{#if clip}
			<div
				aria-hidden="true"
				class={[
					'pointer-events-none absolute inset-0 flex rounded-full bg-neutral-950 p-1',
					slide && 'transition-[clip-path] duration-250 ease-out motion-reduce:transition-none'
				]}
				style:clip-path={clip}
			>
				{#each views as view (view.href)}
					<span class={[label, 'text-white']}>{view.label}</span>
				{/each}
			</div>
		{/if}
	</nav>
</div>
