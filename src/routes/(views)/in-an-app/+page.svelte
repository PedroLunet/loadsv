<!--
	In an app: one believable product with loaders in six places, and a single choice that
	swaps the spinner in all of them at once.
-->
<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { resolve } from '$app/paths';
	import { durations, type SpinnerName } from '$lib/motion.js';
	import { catalog, componentOf, entryOf } from '$site/catalog';
	import { highlight } from '$site/snippet';
	import { prefersReducedMotion, timeline } from '$site/timeline';
	import Code from '$site/components/Code.svelte';
	import CopyButton from '$site/components/CopyButton.svelte';
	import Icon from '$site/components/Icon.svelte';

	type State = 'building' | 'ready' | 'error';
	type Deploy = {
		id: number;
		message: string;
		branch: string;
		state: State;
		took: string;
		when: string;
	};

	const reduce = prefersReducedMotion();
	const t = timeline();

	let chosen = $state<SpinnerName>('snake');
	const entry = $derived(entryOf(chosen));
	const Spinner = $derived(componentOf(entry));

	let deploys = $state<Deploy[]>([
		{
			id: 5,
			message: 'feat: add Snake spinner',
			branch: 'main',
			state: 'building',
			took: '',
			when: 'Just now'
		},
		{
			id: 4,
			message: 'docs: list all 24 spinners',
			branch: 'main',
			state: 'ready',
			took: '38s',
			when: '2h ago'
		},
		{
			id: 3,
			message: 'fix(site): match curly apostrophes in search',
			branch: 'search',
			state: 'ready',
			took: '41s',
			when: 'Yesterday'
		},
		{
			id: 2,
			message: 'test: run e2e against a production build',
			branch: 'e2e',
			state: 'error',
			took: '1m 02s',
			when: '2 days ago'
		}
	]);
	let nextId = 6;
	let elapsed = $state(12);
	let redeploying = $state(false);
	let toast = $state<'hidden' | 'building' | 'ready'>('hidden');
	let query = $state('');
	let applied = $state('');
	let searching = $state(false);

	const building = $derived(deploys.some((d) => d.state === 'building'));
	const visible = $derived(
		deploys.filter((d) => d.message.toLowerCase().includes(applied.trim().toLowerCase()))
	);

	function redeploy() {
		if (redeploying) return;
		redeploying = true;
		t.after(900, () => {
			redeploying = false;
			const id = nextId++;
			deploys = [
				{
					id,
					message: 'Redeploy of feat: add Snake spinner',
					branch: 'main',
					state: 'building',
					took: '',
					when: 'Just now'
				},
				...deploys
			];
			toast = 'building';
			t.after(3600, () => {
				deploys = deploys.map((d) => (d.id === id ? { ...d, state: 'ready', took: '4s' } : d));
				toast = 'ready';
				t.after(2200, () => (toast = 'hidden'));
			});
		});
	}

	let searchTimer: ReturnType<typeof setTimeout> | undefined;
	function search() {
		clearTimeout(searchTimer);
		searching = true;
		searchTimer = setTimeout(() => {
			searching = false;
			applied = query;
		}, 500);
	}

	let picker: HTMLElement;
	let ticker: ReturnType<typeof setInterval>;
	onMount(() => {
		ticker = setInterval(() => (elapsed += 1), 1000);

		// On a phone the picker scrolls, and the default choice sits near its end.
		const active = picker.querySelector('[aria-pressed="true"]');
		if (active && picker.scrollWidth > picker.clientWidth) {
			const strip = picker.getBoundingClientRect();
			const chip = active.getBoundingClientRect();
			picker.scrollLeft += chip.left - strip.left - (strip.width - chip.width) / 2;
		}
	});
	onDestroy(() => {
		t.clear();
		clearInterval(ticker);
		clearTimeout(searchTimer);
	});

	const enter = { y: reduce ? 0 : 12, duration: 400, easing: quintOut };
	const leave = { y: reduce ? 0 : 6, duration: 200, easing: quintOut };
	const rowIn = { y: reduce ? 0 : -6, duration: 250, easing: quintOut };
	const moveRows = { duration: reduce ? 0 : 250, easing: quintOut };

	const code = $derived(`<script>
	import { ${entry.importName} } from 'loadsv';
${'</'}script>

<button disabled={deploying}>
	{#if deploying}<${entry.importName} size={14} />{/if}
	Redeploy
</button>`);

	const nav = ['Overview', 'Deployments', 'Analytics', 'Logs', 'Settings'];
</script>

<svelte:head>
	<title>In an app — loadsv</title>
	<meta
		name="description"
		content="Pick a loadsv spinner and watch every loading state in a working dashboard switch to it."
	/>
</svelte:head>

<div class="mx-auto max-w-[62rem] px-4 sm:px-6">
	<section class="pt-14 text-center sm:pt-20">
		<h1 class="text-[44px] leading-[1.02] font-semibold tracking-[-0.035em] text-balance">
			Try one in a real app.
		</h1>
		<p class="mx-auto mt-4 max-w-md text-[16px] leading-relaxed text-pretty text-neutral-600">
			Pick a spinner. Every loading state in the dashboard below switches to it, from the status
			pill to the toast.
		</p>
	</section>

	<div class="mt-10 flex flex-col items-center gap-3">
		<div
			bind:this={picker}
			role="group"
			aria-label="Spinner"
			class="flex max-w-full [scrollbar-width:none] gap-0.5 overflow-x-auto rounded-2xl border border-neutral-200/70 bg-white p-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
		>
			{#each catalog as item (item.slug)}
				{@const Glyph = componentOf(item)}
				{@const active = item.slug === chosen}
				<button
					type="button"
					aria-pressed={active}
					aria-label={item.name}
					title={item.name}
					onclick={() => (chosen = item.slug)}
					class={[
						'grid size-8 shrink-0 place-items-center rounded-[10px] transition-[background-color,color,scale] duration-150 ease-out active:scale-[0.94]',
						active
							? 'bg-neutral-950 text-white'
							: 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'
					]}
				>
					<Glyph size={16} playState={active ? 'running' : 'paused'} />
				</button>
			{/each}
		</div>
		<p class="text-[13px] text-neutral-500">
			<span class="font-medium text-neutral-900">{entry.name}</span>
			<span class="mx-1 text-neutral-300">·</span>{durations[chosen]}ms
			<span class="mx-1 text-neutral-300">·</span>
			<a
				href={resolve(`/spinners/${chosen}`)}
				class="underline decoration-neutral-300 underline-offset-4 hover:text-neutral-900"
				>Open its playground</a
			>
		</p>
	</div>

	<!-- The app. Everything that waits in here uses the chosen spinner. -->
	<div
		class="relative mt-8 overflow-hidden rounded-2xl border border-neutral-200/80 bg-white text-[13px] shadow-[0_24px_48px_-16px_rgba(0,0,0,0.14),0_2px_6px_rgba(0,0,0,0.04)]"
	>
		<div class="flex h-12 items-center justify-between border-b border-neutral-100 px-4">
			<div class="flex items-center gap-2 text-neutral-500">
				<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" class="text-neutral-900"
					><path d="M12 3 22 20H2z" fill="currentColor" /></svg
				>
				<span class="text-neutral-900">Acme</span>
				<span class="text-neutral-300">/</span>
				<span class="font-medium text-neutral-900">loadsv-docs</span>
			</div>
			<div class="flex items-center gap-3">
				<span
					class="flex h-7 items-center gap-2 rounded-full border border-neutral-200 px-2.5 text-[12px] text-neutral-600"
				>
					{#if building}
						<Spinner size={12} /> Syncing
					{:else}
						<span class="size-1.5 rounded-full bg-emerald-500"></span> Up to date
					{/if}
				</span>
				<span class="size-7 rounded-full bg-linear-to-br from-orange-300 to-rose-400"></span>
			</div>
		</div>

		<div class="flex">
			<div class="hidden w-48 shrink-0 border-r border-neutral-100 p-2 md:block">
				{#each nav as item (item)}
					<span
						class={[
							'flex h-8 items-center justify-between rounded-md px-2.5',
							item === 'Deployments' ? 'bg-neutral-100 text-neutral-950' : 'text-neutral-500'
						]}
					>
						{item}
						{#if item === 'Deployments' && building}<span class="text-neutral-500"
								><Spinner size={12} /></span
							>{/if}
					</span>
				{/each}
			</div>

			<div class="min-w-0 flex-1 p-4 sm:p-5">
				<div class="flex items-center gap-2">
					<h2 class="flex-1 text-[15px] font-medium text-neutral-950">Deployments</h2>
					<label
						class="hidden h-8 w-52 items-center gap-2 rounded-lg border border-neutral-200 px-2.5 transition-[border-color] duration-150 focus-within:border-neutral-400 sm:flex"
					>
						<span class="text-neutral-400"><Icon name="search" size={13} /></span>
						<input
							bind:value={query}
							oninput={search}
							placeholder="Filter commits"
							aria-label="Filter deployments"
							class="min-w-0 flex-1 bg-transparent outline-none placeholder:text-neutral-400"
						/>
						{#if searching}<span class="text-neutral-500"><Spinner size={12} /></span>{/if}
					</label>
					<button
						type="button"
						onclick={redeploy}
						aria-busy={redeploying}
						class="swap h-8 rounded-lg bg-neutral-950 px-3 font-medium text-white transition-[scale,background-color] duration-150 ease-out hover:bg-neutral-800 active:scale-[0.97]"
					>
						<span class="layer" data-shown={!redeploying} aria-hidden={redeploying}>Redeploy</span>
						<span class="layer" data-shown={redeploying} aria-hidden={!redeploying}>
							<Spinner size={14} playState={redeploying ? 'running' : 'paused'} /> Queuing…
						</span>
					</button>
				</div>

				<ul class="mt-4 divide-y divide-neutral-100 rounded-xl border border-neutral-200/70">
					{#each visible as deploy (deploy.id)}
						<li
							in:fly={rowIn}
							animate:flip={moveRows}
							class="flex items-center gap-4 bg-white px-3.5 py-3 first:rounded-t-xl last:rounded-b-xl"
						>
							<span class="flex w-24 shrink-0 items-center gap-2">
								{#if deploy.state === 'building'}
									<span class="text-neutral-600"><Spinner size={14} /></span>
									<span class="text-neutral-900">Building</span>
								{:else if deploy.state === 'ready'}
									<span class="grid size-3.5 place-items-center"
										><span class="size-2 rounded-full bg-emerald-500"></span></span
									>
									<span class="text-neutral-700">Ready</span>
								{:else}
									<span class="grid size-3.5 place-items-center"
										><span class="size-2 rounded-full bg-red-500"></span></span
									>
									<span class="text-neutral-700">Error</span>
								{/if}
							</span>
							<span class="min-w-0 flex-1">
								<span class="block truncate text-neutral-900">{deploy.message}</span>
								<span class="font-mono text-[11.5px] text-neutral-400">{deploy.branch}</span>
							</span>
							<span class="hidden w-16 text-right text-neutral-500 tabular-nums sm:block">
								{deploy.state === 'building' && deploy.id === 5 ? `${elapsed}s` : deploy.took}
							</span>
							<span class="hidden w-20 text-right text-neutral-400 lg:block">{deploy.when}</span>
						</li>
					{:else}
						<li class="px-3.5 py-6 text-center text-neutral-500">No deployments match.</li>
					{/each}
				</ul>
			</div>
		</div>

		{#if toast !== 'hidden'}
			<div
				in:fly={enter}
				out:fly={leave}
				role="status"
				class="absolute right-4 bottom-4 left-4 flex items-center gap-3 rounded-xl border border-neutral-200/80 bg-white px-3.5 py-3 shadow-[0_6px_20px_rgba(0,0,0,0.1)] sm:left-auto sm:w-72"
			>
				<span class="swap size-4 shrink-0">
					<span class="layer" data-shown={toast === 'building'}>
						<Spinner size={16} playState={toast === 'building' ? 'running' : 'paused'} />
					</span>
					<span class="layer text-emerald-600" data-shown={toast === 'ready'}>
						<Icon name="check" size={16} />
					</span>
				</span>
				<span class="swap min-w-0 flex-1">
					<span
						class="layer start flex-col"
						data-shown={toast === 'building'}
						aria-hidden={toast !== 'building'}
					>
						<span class="font-medium text-neutral-900">Deploying loadsv-docs</span>
						<span class="text-neutral-500">Redeploy of main</span>
					</span>
					<span
						class="layer start flex-col"
						data-shown={toast === 'ready'}
						aria-hidden={toast !== 'ready'}
					>
						<span class="font-medium text-neutral-900">Deployed</span>
						<span class="text-neutral-500">Ready in 4s</span>
					</span>
				</span>
			</div>
		{/if}
	</div>
	<p class="mt-3 text-center text-[12.5px] text-neutral-400">
		Press Redeploy to watch a build go through every state.
	</p>

	<!-- minmax(0, …) lets the code scroll inside its track instead of widening it. -->
	<section
		class="grid grid-cols-[minmax(0,1fr)] gap-8 pt-20 pb-24 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]"
	>
		<div>
			<h2 class="text-[15px] font-medium text-neutral-950">Install</h2>
			<p class="mt-1.5 text-[14px] leading-relaxed text-neutral-600">
				One package, 24 components, no dependencies. The motion is plain CSS, and it holds still for
				anyone who prefers less of it.
			</p>
			<div
				class="mt-4 flex items-center justify-between rounded-xl border border-neutral-200/60 bg-neutral-50/70 py-1.5 pr-1.5 pl-4 font-mono text-[12.5px]"
			>
				<code>npm install loadsv</code>
				<CopyButton text="npm install loadsv" label="Copy install command" />
			</div>
		</div>
		<div>
			<h2 class="text-[15px] font-medium text-neutral-950">The Redeploy button</h2>
			<div class="mt-3 rounded-xl border border-neutral-200/60 bg-neutral-50/70">
				<Code lines={highlight(code)} />
			</div>
		</div>
	</section>
</div>

<style>
	.swap {
		display: grid;
	}

	.layer {
		grid-area: 1 / 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		transition:
			opacity 200ms var(--ease-out),
			scale 200ms var(--ease-out),
			filter 200ms var(--ease-out);
	}

	.layer.start {
		align-items: flex-start;
		gap: 0;
	}

	.layer[data-shown='false'] {
		opacity: 0;
		scale: 0.94;
		filter: blur(2px);
		pointer-events: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.layer[data-shown='false'] {
			scale: 1;
			filter: none;
		}
	}
</style>
