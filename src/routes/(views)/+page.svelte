<!--
	Try it: a narrow column where every section is a real moment you trigger yourself: a
	button, a field, a toast, a chat, a panel. Pick a spinner and the code follows.
-->
<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { resolve } from '$app/paths';
	import { durations, type SpinnerName } from '$lib/motion.js';
	import { catalog, componentOf, entryOf } from '$site/catalog';
	import { GITHUB_URL } from '$site/links';
	import { highlight } from '$site/snippet';
	import { prefersReducedMotion, timeline } from '$site/timeline';
	import Code from '$site/components/Code.svelte';
	import CopyButton from '$site/components/CopyButton.svelte';
	import Icon from '$site/components/Icon.svelte';
	import Chips from '$site/components/SpinnerChips.svelte';

	type Step = 'idle' | 'loading' | 'done';

	const reduce = prefersReducedMotion();
	const enter = { y: reduce ? 0 : 12, duration: 400, easing: quintOut };
	const leave = { y: reduce ? 0 : 6, duration: 200, easing: quintOut };
	const pop = { y: reduce ? 0 : 8, duration: 250, easing: quintOut };

	const importOf = (slug: SpinnerName) => entryOf(slug).importName;
	const spinnerOf = (slug: SpinnerName) => componentOf(entryOf(slug));
	const stage =
		'relative grid h-60 place-items-center overflow-hidden rounded-xl border border-neutral-200/60 bg-neutral-50';
	const card =
		'rounded-xl border border-neutral-200/80 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]';

	/* Hero: the first button on the page is already a demo. Each press borrows the next spinner. */
	const heroSpinners: SpinnerName[] = ['arc', 'snake', 'dual', 'ring', 'comet', 'classic'];
	const heroT = timeline();
	let heroIndex = $state(0);
	let hero = $state<Step>('idle');
	const HeroSpinner = $derived(spinnerOf(heroSpinners[heroIndex]));

	function loadSomething() {
		if (hero !== 'idle') return;
		hero = 'loading';
		heroT.after(1600, () => {
			hero = 'done';
			heroT.after(1200, () => {
				hero = 'idle';
				heroIndex = (heroIndex + 1) % heroSpinners.length;
			});
		});
	}

	/* Buttons */
	const buttonT = timeline();
	let buttonSpinner = $state<SpinnerName>('arc');
	let button = $state<Step>('idle');
	const ButtonSpinner = $derived(spinnerOf(buttonSpinner));

	function save() {
		if (button === 'loading') return;
		buttonT.clear();
		button = 'loading';
		buttonT.after(1600, () => {
			button = 'done';
			buttonT.after(1400, () => (button = 'idle'));
		});
	}

	/* Fields */
	const taken = new Set(['admin', 'root', 'svelte', 'loadsv', 'emil']);
	const fieldT = timeline();
	let fieldSpinner = $state<SpinnerName>('ring');
	let handle = $state('pedro');
	let field = $state<'idle' | 'checking' | 'free' | 'taken'>('free');
	const FieldSpinner = $derived(spinnerOf(fieldSpinner));

	function check() {
		fieldT.clear();
		const value = handle.trim().toLowerCase();
		if (!value) {
			field = 'idle';
			return;
		}
		field = 'checking';
		fieldT.after(900, () => (field = taken.has(value) ? 'taken' : 'free'));
	}

	/* Toasts */
	const toastT = timeline();
	let toastSpinner = $state<SpinnerName>('snake');
	let toast = $state<'hidden' | 'loading' | 'done'>('hidden');
	const ToastSpinner = $derived(spinnerOf(toastSpinner));

	function deploy() {
		toastT.clear();
		toast = 'loading';
		toastT.after(2400, () => {
			toast = 'done';
			toastT.after(2000, () => (toast = 'hidden'));
		});
	}

	/* Chat */
	const exchanges = [
		[
			'What’s new in loadsv?',
			'Thirteen new spinners, 25 in all. Snake is the only one that repaints.'
		],
		['Do they respect reduced motion?', 'Yes. They hold still and breathe gently instead.'],
		[
			'What does one cost me?',
			'One small component, no dependencies, no JavaScript while it plays.'
		]
	];
	const chatT = timeline();
	let chatSpinner = $state<SpinnerName>('bouncing-dots');
	let messages = $state([
		{ id: 0, mine: true, text: exchanges[0][0] },
		{ id: 1, mine: false, text: exchanges[0][1] }
	]);
	let nextId = 2;
	let turn = $state(1);
	let draft = $state(exchanges[1][0]);
	let thinking = $state(false);
	const ChatSpinner = $derived(spinnerOf(chatSpinner));

	function ask(event?: SubmitEvent) {
		event?.preventDefault();
		if (thinking) return;
		const text = draft.trim() || exchanges[turn][0];
		const answer = exchanges[turn][1];
		messages = [...messages, { id: nextId++, mine: true, text }].slice(-3);
		thinking = true;
		turn = (turn + 1) % exchanges.length;
		draft = exchanges[turn][0];
		chatT.after(1800, () => {
			thinking = false;
			messages = [...messages, { id: nextId++, mine: false, text: answer }].slice(-3);
		});
	}

	/* Panels */
	const invoices = [
		{ id: 'INV-2041', client: 'Acme Co', amount: '$1,240.00', paid: true },
		{ id: 'INV-2040', client: 'Globex', amount: '$320.00', paid: false },
		{ id: 'INV-2039', client: 'Initech', amount: '$89.00', paid: true }
	];
	const panelT = timeline();
	let panelSpinner = $state<SpinnerName>('blocks');
	let panelLoading = $state(true);
	const PanelSpinner = $derived(spinnerOf(panelSpinner));

	function refresh() {
		panelT.clear();
		panelLoading = true;
		panelT.after(1800, () => (panelLoading = false));
	}

	onMount(refresh);
	onDestroy(() => [heroT, buttonT, fieldT, toastT, chatT, panelT].forEach((t) => t.clear()));

	const scriptEnd = '</' + 'script>';
	const usage = `<script>
	import { Arc } from 'loadsv';
${scriptEnd}

<Arc />
<Arc size={32} color="#ff3e00" />`;
</script>

<svelte:head>
	<title>loadsv — Loading indicators for Svelte</title>
	<meta
		name="description"
		content="A lightweight library of beautiful loading indicators for Svelte."
	/>
</svelte:head>

{#snippet code(source: string, space = 'mt-3')}
	<div class={['rounded-xl border border-neutral-200/60 bg-neutral-50/70', space]}>
		<Code lines={highlight(source)} />
	</div>
{/snippet}

<div class="mx-auto max-w-[34rem] px-6">
	<section class="flex flex-col items-center pt-16 pb-16 text-center sm:pt-24 sm:pb-20">
		<h1 class="text-[40px] leading-none font-semibold tracking-[-0.035em]">loadsv</h1>
		<p class="mt-3 text-[16px] text-neutral-600">
			Loading indicators for Svelte, made to sit inside your UI.
		</p>
		<div class="mt-7 flex gap-2">
			<button
				type="button"
				onclick={loadSomething}
				aria-busy={hero === 'loading'}
				class="swap h-10 rounded-[10px] bg-neutral-950 px-4 text-[14px] font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.12)] transition-[scale,background-color] duration-150 ease-out hover:bg-neutral-800 active:scale-[0.97]"
			>
				<span class="layer" data-shown={hero === 'idle'} aria-hidden={hero !== 'idle'}
					>Load something</span
				>
				<span class="layer" data-shown={hero === 'loading'} aria-hidden={hero !== 'loading'}>
					<HeroSpinner size={14} playState={hero === 'loading' ? 'running' : 'paused'} />
					Loading…
				</span>
				<span class="layer" data-shown={hero === 'done'} aria-hidden={hero !== 'done'}>
					<Icon name="check" size={14} /> Done
				</span>
			</button>
			<a
				href={GITHUB_URL}
				rel="external"
				class="flex h-10 items-center rounded-[10px] border border-neutral-200 bg-white px-4 text-[14px] font-medium text-neutral-800 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-[scale,background-color] duration-150 ease-out hover:bg-neutral-50 active:scale-[0.97]"
				>GitHub</a
			>
		</div>
		<a
			href="#spinners"
			class="mt-4 text-[13px] text-neutral-500 underline decoration-neutral-300 underline-offset-4 hover:text-neutral-900"
			>All 25 spinners</a
		>
	</section>

	<section class="section">
		<h2>Installation</h2>
		<div
			class="mt-3 flex items-center justify-between rounded-xl border border-neutral-200/60 bg-neutral-50/70 py-1.5 pr-1.5 pl-4 font-mono text-[12.5px]"
		>
			<code>npm install loadsv</code>
			<CopyButton text="npm install loadsv" label="Copy install command" />
		</div>
	</section>

	<section class="section">
		<h2>Usage</h2>
		<p>Import a spinner and drop it in. It takes the text color around it.</p>
		{@render code(usage, 'mt-4')}
	</section>

	<section class="section">
		<h2>In a button</h2>
		<p>Swap the label for a spinner while the action runs. The button keeps its width.</p>
		<div class={[stage, 'mt-4']}>
			<div class={[card, 'w-72 p-4']}>
				<label class="block text-[13px] font-medium text-neutral-900" for="display-name"
					>Display name</label
				>
				<input
					id="display-name"
					value="Pedro Lunet"
					class="mt-1.5 h-9 w-full rounded-lg border border-neutral-200 px-3 text-[14px] transition-[border-color] duration-150 outline-none focus:border-neutral-400"
				/>
				<div class="mt-4 flex justify-end gap-1.5">
					<button
						type="button"
						class="h-8 rounded-lg px-3 text-[13px] text-neutral-600 transition-[background-color,scale] duration-150 ease-out hover:bg-neutral-100 active:scale-[0.97]"
						>Cancel</button
					>
					<button
						type="button"
						onclick={save}
						aria-busy={button === 'loading'}
						class="swap h-8 rounded-lg bg-neutral-950 px-3 text-[13px] font-medium text-white transition-[scale,background-color] duration-150 ease-out hover:bg-neutral-800 active:scale-[0.97]"
					>
						<span class="layer" data-shown={button === 'idle'} aria-hidden={button !== 'idle'}
							>Save changes</span
						>
						<span
							class="layer"
							data-shown={button === 'loading'}
							aria-hidden={button !== 'loading'}
						>
							<ButtonSpinner size={14} playState={button === 'loading' ? 'running' : 'paused'} />
							Saving…
						</span>
						<span class="layer" data-shown={button === 'done'} aria-hidden={button !== 'done'}>
							<Icon name="check" size={14} /> Saved
						</span>
					</button>
				</div>
			</div>
		</div>
		<div class="mt-3">
			<Chips
				label="Spinner in the button"
				options={['arc', 'ring', 'dual', 'snake', 'comet', 'classic', 'clock', 'circular-dots']}
				bind:value={buttonSpinner}
				onchange={save}
			/>
		</div>
		{@render code(`<button disabled={saving}>
	{#if saving}<${importOf(buttonSpinner)} size={14} />{/if}
	{saving ? 'Saving…' : 'Save changes'}
</button>`)}
	</section>

	<section class="section">
		<h2>In a field</h2>
		<p>Check while they type. A small spinner at the end of the field says the app heard them.</p>
		<div class={[stage, 'mt-4']}>
			<div class="w-72">
				<label for="handle" class="block text-[13px] font-medium text-neutral-900">Username</label>
				<div
					class="mt-1.5 flex h-9 items-center rounded-lg border border-neutral-200 bg-white pr-3 transition-[border-color] duration-150 focus-within:border-neutral-400"
				>
					<span class="pl-3 text-[14px] text-neutral-400 select-none">@</span>
					<input
						id="handle"
						bind:value={handle}
						oninput={check}
						spellcheck="false"
						autocomplete="off"
						class="h-full min-w-0 flex-1 bg-transparent pl-0.5 text-[14px] outline-none"
					/>
					<span class="swap size-4 text-neutral-500">
						<span class="layer" data-shown={field === 'checking'}>
							<FieldSpinner size={14} playState={field === 'checking' ? 'running' : 'paused'} />
						</span>
						<span class="layer text-emerald-600" data-shown={field === 'free'}>
							<Icon name="check" size={14} />
						</span>
						<span class="layer text-red-500" data-shown={field === 'taken'}>
							<svg
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg
							>
						</span>
					</span>
				</div>
				<p class="mt-2 h-4 text-[12.5px] text-neutral-500" aria-live="polite">
					{#if field === 'checking'}
						Checking…
					{:else if field === 'free'}
						<span class="text-neutral-800">@{handle.trim()}</span> is available.
					{:else if field === 'taken'}
						That one’s taken. Try another.
					{:else}
						Letters, numbers and dashes.
					{/if}
				</p>
			</div>
		</div>
		<div class="mt-3">
			<Chips
				label="Spinner in the field"
				options={['ring', 'arc', 'circular-dots', 'classic', 'snake', 'dual']}
				bind:value={fieldSpinner}
				onchange={check}
			/>
		</div>
		{@render code(`<input bind:value={handle} oninput={check} />
{#if checking}<${importOf(fieldSpinner)} size={14} />{/if}`)}
	</section>

	<section class="section">
		<h2>In a toast</h2>
		<p>For work that happens somewhere else. Say what’s running, then say that it’s done.</p>
		<div class={[stage, 'mt-4']}>
			<button
				type="button"
				onclick={deploy}
				class="h-9 rounded-lg border border-neutral-200 bg-white px-3.5 text-[13px] font-medium text-neutral-800 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-[scale,background-color] duration-150 ease-out hover:bg-neutral-50 active:scale-[0.97]"
				>Deploy loadsv-docs</button
			>
			{#if toast !== 'hidden'}
				<div class="absolute inset-x-0 bottom-4 flex justify-center px-4">
					<div
						in:fly={enter}
						out:fly={leave}
						role="status"
						class="flex w-72 items-center gap-3 rounded-xl border border-neutral-200/80 bg-white px-3.5 py-3 shadow-[0_6px_20px_rgba(0,0,0,0.08)]"
					>
						<span class="swap size-4 shrink-0">
							<span class="layer" data-shown={toast === 'loading'}>
								<ToastSpinner size={16} playState={toast === 'loading' ? 'running' : 'paused'} />
							</span>
							<span class="layer text-emerald-600" data-shown={toast === 'done'}>
								<Icon name="check" size={16} />
							</span>
						</span>
						<span class="swap min-w-0 flex-1 text-[13px]">
							<span
								class="layer start flex-col"
								data-shown={toast === 'loading'}
								aria-hidden={toast !== 'loading'}
							>
								<span class="font-medium text-neutral-900">Deploying loadsv-docs</span>
								<span class="text-neutral-500">Building in 3 regions</span>
							</span>
							<span
								class="layer start flex-col"
								data-shown={toast === 'done'}
								aria-hidden={toast !== 'done'}
							>
								<span class="font-medium text-neutral-900">Deployed</span>
								<span class="text-neutral-500">Ready in 14s</span>
							</span>
						</span>
					</div>
				</div>
			{/if}
		</div>
		<div class="mt-3">
			<Chips
				label="Spinner in the toast"
				options={['snake', 'arc', 'hourglass', 'infinity-loop', 'atom', 'eclipse']}
				bind:value={toastSpinner}
				onchange={deploy}
			/>
		</div>
		{@render code(`<div role="status" class="toast">
	<${importOf(toastSpinner)} size={16} />
	Deploying loadsv-docs
</div>`)}
	</section>

	<section class="section">
		<h2>While someone’s typing</h2>
		<p>Or something. Ask a question and watch the reply get written.</p>
		<div class={[stage, 'mt-4 h-72']}>
			<div class={[card, 'flex h-60 w-80 flex-col overflow-hidden']}>
				<ol class="flex flex-1 flex-col justify-end gap-2 overflow-hidden p-3">
					{#each messages as message (message.id)}
						<li
							in:fly={pop}
							class={[
								'max-w-[85%] rounded-2xl px-3 py-2 text-[13px] leading-snug',
								message.mine
									? 'self-end rounded-br-md bg-neutral-950 text-white'
									: 'self-start rounded-bl-md bg-neutral-100 text-neutral-800'
							]}
						>
							{message.text}
						</li>
					{/each}
					{#if thinking}
						<li
							in:fly={pop}
							class="grid h-9 w-14 place-items-center self-start rounded-2xl rounded-bl-md bg-neutral-100 text-neutral-500"
							aria-label="Assistant is typing"
						>
							<ChatSpinner size={20} />
						</li>
					{/if}
				</ol>
				<form onsubmit={ask} class="flex gap-1.5 border-t border-neutral-100 p-2">
					<input
						bind:value={draft}
						aria-label="Message"
						class="h-8 min-w-0 flex-1 rounded-lg bg-neutral-50 px-2.5 text-[13px] outline-none focus:bg-neutral-100"
					/>
					<button
						disabled={thinking}
						class="h-8 rounded-lg bg-neutral-950 px-3 text-[13px] font-medium text-white transition-[scale,opacity] duration-150 ease-out active:scale-[0.97] disabled:opacity-40"
						>Send</button
					>
				</form>
			</div>
		</div>
		<div class="mt-3">
			<Chips
				label="Typing indicator"
				options={['bouncing-dots', 'linear-dots', 'wave', 'leap', 'pulse']}
				bind:value={chatSpinner}
				onchange={() => ask()}
			/>
		</div>
		{@render code(`{#if typing}
	<div class="bubble" aria-label="Assistant is typing">
		<${importOf(chatSpinner)} size={20} />
	</div>
{/if}`)}
	</section>

	<section class="section">
		<h2>When a whole panel waits</h2>
		<p>Give the spinner room, and a sentence saying what it’s waiting for.</p>
		<div class={[stage, 'mt-4 h-72']}>
			<div class={[card, 'w-80 overflow-hidden']}>
				<div class="flex items-center justify-between border-b border-neutral-100 py-2 pr-2 pl-4">
					<span class="text-[13px] font-medium text-neutral-900">Invoices</span>
					<button
						type="button"
						onclick={refresh}
						class="flex h-7 items-center gap-1.5 rounded-md px-2 text-[12.5px] text-neutral-500 transition-[background-color,color,scale] duration-150 ease-out hover:bg-neutral-100 hover:text-neutral-900 active:scale-[0.97]"
					>
						<Icon name="reset" size={12} /> Refresh
					</button>
				</div>
				<div class="swap h-40">
					<div
						class="layer flex-col gap-3 text-neutral-500"
						data-shown={panelLoading}
						aria-hidden={!panelLoading}
					>
						<PanelSpinner size={28} playState={panelLoading ? 'running' : 'paused'} />
						<span class="text-[13px]">Fetching invoices…</span>
					</div>
					<ul
						class="layer flex-col items-stretch! justify-start!"
						data-shown={!panelLoading}
						aria-hidden={panelLoading}
					>
						{#each invoices as invoice (invoice.id)}
							<li
								class="flex h-[53px] items-center gap-3 border-b border-neutral-100 px-4 text-[13px] last:border-0"
							>
								<span class="flex-1">
									<span class="block font-medium text-neutral-900">{invoice.client}</span>
									<span class="font-mono text-[11.5px] text-neutral-400">{invoice.id}</span>
								</span>
								<span class="text-neutral-800 tabular-nums">{invoice.amount}</span>
								<span
									class={[
										'w-10 text-right text-[12px]',
										invoice.paid ? 'text-emerald-600' : 'text-amber-600'
									]}>{invoice.paid ? 'Paid' : 'Due'}</span
								>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>
		<div class="mt-3">
			<Chips
				label="Spinner in the panel"
				options={['blocks', 'swirl', 'newtons-cradle', 'slide', 'flip', 'bounce', 'ripple']}
				bind:value={panelSpinner}
				onchange={refresh}
			/>
		</div>
		{@render code(`{#await invoices}
	<${importOf(panelSpinner)} size={28} />
	<p>Fetching invoices…</p>
{:then rows}
	<InvoiceList {rows} />
{/await}`)}
	</section>

	<section id="spinners" class="section scroll-mt-10 pb-24">
		<h2>Every spinner</h2>
		<p>Hover one to play it. Each has its own page with a playground and every option.</p>
		<ul class="mt-4 grid grid-cols-1 gap-x-8 sm:grid-cols-2">
			{#each catalog as entry (entry.slug)}
				{@const Spinner = componentOf(entry)}
				<li>
					<a
						href={resolve('/(docs)/spinners/[slug]', { slug: entry.slug })}
						class="flex h-11 items-center gap-3 border-b border-neutral-100 text-[14px] text-neutral-800 transition-colors duration-150 [--lsv-play-state:paused] hover:text-neutral-950 hover:[--lsv-play-state:running] focus-visible:[--lsv-play-state:running]"
					>
						<Spinner size={16} />
						<span class="flex-1">{entry.name}</span>
						<span class="font-mono text-[11.5px] text-neutral-400 tabular-nums"
							>{durations[entry.slug]}ms</span
						>
					</a>
				</li>
			{/each}
		</ul>
	</section>
</div>

<style>
	.section {
		padding-top: 3.5rem;
	}

	.section > h2 {
		font-size: 15px;
		font-weight: 500;
		color: var(--color-neutral-950);
	}

	.section > p {
		margin-top: 0.375rem;
		font-size: 15px;
		line-height: 1.6;
		color: var(--color-neutral-600);
		text-wrap: pretty;
	}

	/* States share one grid cell, so the widest sets the size and nothing shifts. */
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
		justify-content: center;
		gap: 0;
	}

	/* The blur blends the outgoing and incoming states into one change. */
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
