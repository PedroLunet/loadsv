<!--
	Switches between the three ways to see the library, after burocratik.com. At rest it's a
	dark bar: the mark, the view you're on, and a plus. The whole bar is one button, and
	pressing it grows the same surface up into three cards, each running its view's spinner,
	with the docs, links and install command beneath. The reveal is a clip-path from the
	bar's edge, and the page behind dims.

	Until the page hydrates there's no script to open it, so hovering or focusing the dock
	opens it instead, and the links work from the first paint.
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { Arc, BouncingDots, Classic, Snake } from '$lib';
	import { catalog } from '$site/catalog';
	import { GITHUB_URL, NPM_URL } from '$site/links';
	import Icon from './Icon.svelte';

	// Matched by route, not href: prerendered hrefs are relative, so they never equal the URL.
	const views = [
		{
			route: '/(views)',
			href: resolve('/'),
			label: 'Try it',
			blurb: 'Play with each spinner, live',
			spinner: Arc
		},
		{
			route: '/(views)/browse',
			href: resolve('/browse'),
			label: 'Browse',
			blurb: `All ${catalog.length}, each where it belongs`,
			spinner: BouncingDots
		},
		{
			route: '/(views)/in-an-app',
			href: resolve('/in-an-app'),
			label: 'In an app',
			blurb: 'Swap them into a real dashboard',
			spinner: Snake
		}
	];
	const current = $derived(views.findIndex((view) => view.route === page.route.id));

	const id = $props.id();
	let open = $state(false);
	let hydrated = $state(false);
	let copied = $state(false);
	let copiedTimer: ReturnType<typeof setTimeout> | undefined;
	let nav: HTMLElement;
	let trigger: HTMLButtonElement;

	function close(refocus = false) {
		open = false;
		if (refocus) trigger.focus();
	}

	async function copy() {
		await navigator.clipboard.writeText('npm i loadsv');
		copied = true;
		clearTimeout(copiedTimer);
		copiedTimer = setTimeout(() => (copied = false), 1500);
	}

	// The dock lives in the layout, so it outlasts the navigation a card starts; close after.
	afterNavigate(() => (open = false));
	onMount(() => (hydrated = true));

	const link = 'transition-colors duration-150 ease-out hover:text-neutral-50';
</script>

<svelte:window
	onkeydown={(e) => {
		if (open && e.key === 'Escape') close(true);
	}}
	onpointerdown={(e) => {
		if (open && !nav.contains(e.target as Node)) close();
	}}
/>

<!-- Sticky, not fixed: at the end of the page it rests in its own space above the footer. -->
<div class="pointer-events-none sticky bottom-0 z-30 flex justify-center px-4 pb-4">
	<div
		aria-hidden="true"
		class={[
			'fixed inset-0 bg-neutral-950/25 transition-opacity duration-300 ease-out',
			open ? 'pointer-events-auto opacity-100' : 'opacity-0'
		]}
	></div>

	<nav
		bind:this={nav}
		aria-label="Views"
		class="dock relative h-12 w-[26rem] max-w-[calc(100vw-2rem)]"
		class:hydrated
	>
		<div class="lift absolute inset-x-0 bottom-0">
			<!--
				Bar first, so focus moves from it into the cards; flex-col-reverse puts it below.
				Only the panel takes the pointer, and clip-path trims that to the part you can see,
				so the page above a closed dock stays clickable.
			-->
			<div
				class="panel pointer-events-auto flex flex-col-reverse bg-neutral-950 text-neutral-50"
				class:open
			>
				<button
					bind:this={trigger}
					type="button"
					aria-expanded={hydrated ? open : undefined}
					aria-controls="{id}-views"
					aria-label={views[current] ? `Views, now ${views[current].label}` : 'Views'}
					onclick={() => (open = !open)}
					class="group flex h-12 w-full shrink-0 items-center justify-between rounded-[14px] pr-1.5 pl-4 focus-visible:-outline-offset-2"
				>
					<span class="flex items-center gap-2">
						<!-- The mark is the library's Classic spinner, set going when you reach for it. -->
						<span class="mark flex"><Classic size={16} color="var(--color-svelte)" /></span>
						<span
							class="relative block h-5 overflow-hidden text-[14px] font-semibold tracking-tight"
						>
							<span
								class="flex flex-col transition-[translate] duration-200 ease-out group-hover:-translate-y-5 motion-reduce:transition-none"
							>
								<span class="h-5 leading-5">loadsv</span>
								<span class="h-5 leading-5 font-medium text-neutral-400"
									>{open ? 'Close' : 'Views'}</span
								>
							</span>
						</span>
					</span>
					<span class="flex items-center gap-0.5">
						{#if views[current]}
							<span
								class="rounded-lg bg-neutral-50 px-2.5 py-1 text-[13px] leading-5 font-medium text-neutral-950"
								>{views[current].label}</span
							>
						{/if}
						<span class="plus grid size-9 place-items-center"><Icon name="plus" size={14} /></span>
					</span>
				</button>

				<!-- Reachable without script; once hydrated, out of reach while closed. -->
				<div id="{id}-views" inert={hydrated && !open} class="border-b border-white/8">
					<ul class="grid grid-cols-3 gap-1.5 p-1.5">
						{#each views as view, i (view.route)}
							{@const here = i === current}
							<li class="reveal" style:--i={1 + i * 0.5}>
								<a
									href={view.href}
									aria-current={here ? 'page' : undefined}
									onclick={() => (open = false)}
									class={[
										'flex h-36 flex-col justify-between rounded-[14px] p-3 transition-[background-color,scale] duration-150 ease-out active:scale-[0.98]',
										here
											? 'ring-1 ring-white/8 ring-inset'
											: 'bg-white/7 hover:bg-white/12 focus-visible:bg-white/12'
									]}
								>
									<span class="flex items-start justify-between">
										<view.spinner size={20} />
										{#if here}
											<span class="text-[11px] text-neutral-500" aria-hidden="true">Here</span>
										{/if}
									</span>
									<span>
										<span class={['block text-[14px] font-medium', here && 'text-neutral-500']}
											>{view.label}</span
										>
										<span class="block text-[12px] leading-snug text-neutral-400">{view.blurb}</span
										>
									</span>
								</a>
							</li>
						{/each}
					</ul>

					<div
						class="reveal flex items-center justify-between gap-3 border-t border-white/8 py-2.5 pr-2.5 pl-4 text-[13px]"
						style:--i={0}
					>
						<ul class="flex gap-4 text-neutral-400">
							<li><a href={resolve('/spinners/arc')} class={link}>Docs</a></li>
							<li><a href={GITHUB_URL} rel="external" class={link}>GitHub</a></li>
							<li><a href={NPM_URL} rel="external" class={link}>npm</a></li>
							<li class="hidden sm:list-item">
								<a href={resolve('/llms.txt')} class={link}>llms.txt</a>
							</li>
						</ul>
						<button
							type="button"
							onclick={copy}
							aria-label="Copy install command"
							class="flex h-7 items-center gap-1.5 rounded-lg bg-white/7 px-2.5 font-mono text-[12px] transition-[background-color,scale] duration-150 ease-out hover:bg-white/12 active:scale-[0.97]"
						>
							<span class="grid text-neutral-400">
								<span class="icon" class:shown={!copied}><Icon name="copy" size={12} /></span>
								<span class="icon" class:shown={copied}><Icon name="check" size={12} /></span>
							</span>
							npm i loadsv
						</button>
						<span class="sr-only" aria-live="polite">{copied ? 'Copied' : ''}</span>
					</div>
				</div>
			</div>
		</div>
	</nav>
</div>

<style>
	/* A drop-shadow, not a box-shadow: it follows the clipped shape instead of being cut away. */
	.lift {
		filter: drop-shadow(0 12px 24px rgb(0 0 0 / 0.24)) drop-shadow(0 2px 4px rgb(0 0 0 / 0.12));
	}

	/*
		Closed, only the bottom 48px, the bar, is uncovered; open, all of it. Opening glides
		like a drawer, closing gets out of the way faster. Spinners inside only run while open.
	*/
	.panel {
		--lsv-play-state: paused;
		clip-path: inset(calc(100% - 48px) 0 0 round 14px);
		transition: clip-path 220ms var(--ease-out);
	}

	.panel.open,
	.dock:not(.hydrated):is(:hover, :focus-within) .panel {
		--lsv-play-state: running;
		clip-path: inset(0 round 20px);
		transition: clip-path 420ms cubic-bezier(0.32, 0.72, 0, 1);
	}

	/* The rows fade up from the bar, the nearest first. */
	.reveal {
		opacity: 0;
		translate: 0 8px;
		transition:
			opacity 120ms ease-out,
			translate 120ms ease-out;
	}

	.panel.open .reveal,
	.dock:not(.hydrated):is(:hover, :focus-within) .reveal {
		opacity: 1;
		translate: 0 0;
		transition:
			opacity 300ms var(--ease-out) calc(40ms + var(--i) * 35ms),
			translate 300ms var(--ease-out) calc(40ms + var(--i) * 35ms);
	}

	.plus {
		transition: rotate 200ms var(--ease-out);
	}

	.panel.open .plus,
	.dock:not(.hydrated):is(:hover, :focus-within) .plus {
		rotate: 45deg;
	}

	.mark {
		--lsv-play-state: paused;
	}

	.panel.open .mark {
		--lsv-play-state: running;
	}

	@media (hover: hover) {
		.group:hover .mark {
			--lsv-play-state: running;
		}
	}

	/* Both icons share one cell; the blur blends the swap into a single change. */
	.icon {
		grid-area: 1 / 1;
		transition:
			opacity 200ms var(--ease-out),
			scale 200ms var(--ease-out),
			filter 200ms var(--ease-out);
	}

	.icon:not(.shown) {
		opacity: 0;
		scale: 0.6;
		filter: blur(2px);
	}

	@media (prefers-reduced-motion: reduce) {
		.icon:not(.shown) {
			scale: 1;
			filter: none;
		}

		.panel,
		.panel.open,
		.dock:not(.hydrated):is(:hover, :focus-within) .panel,
		.plus {
			transition: none;
		}

		.reveal {
			translate: none;
		}
	}
</style>
