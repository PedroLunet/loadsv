<!--
	⌘K / Ctrl+K spinner search. A native <dialog> provides the focus trap, Escape and the
	inert background; the input follows the ARIA combobox pattern. It opens and closes
	without animation: it's keyboard-driven and used often, so any motion would only slow it.
-->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { catalog, componentOf, type Entry } from '$site/catalog';
	import { search } from '$site/search.svelte';
	import Icon from './Icon.svelte';

	const id = $props.id();

	let dialog: HTMLDialogElement;
	let query = $state('');
	let active = $state(0);

	const results = $derived(filter(query));
	const optionId = (entry: Entry) => `${id}-${entry.slug}`;

	function rank(entry: Entry, needle: string) {
		const name = entry.name.toLowerCase();
		if (name.startsWith(needle)) return 3;
		if (name.includes(needle)) return 2;
		// Descriptions match on word starts only, or short queries would hit half the catalog.
		if (
			entry.description
				.toLowerCase()
				.split(/\W+/)
				.some((w) => w.startsWith(needle))
		)
			return 1;
		return 0;
	}

	function filter(value: string) {
		const needle = value.trim().toLowerCase();
		if (!needle) return catalog;
		return catalog
			.map((entry) => ({ entry, rank: rank(entry, needle) }))
			.filter((result) => result.rank > 0)
			.sort((a, b) => b.rank - a.rank)
			.map((result) => result.entry);
	}

	function choose(entry: Entry) {
		search.open = false;
		goto(resolve('/spinners/[slug]', { slug: entry.slug }));
	}

	function onkeydown(event: KeyboardEvent) {
		const count = results.length;
		if (event.key === 'ArrowDown' && count) {
			event.preventDefault();
			active = (active + 1) % count;
		} else if (event.key === 'ArrowUp' && count) {
			event.preventDefault();
			active = (active - 1 + count) % count;
		} else if (event.key === 'Enter' && results[active]) {
			event.preventDefault();
			choose(results[active]);
		}
	}

	function onglobalkeydown(event: KeyboardEvent) {
		if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
			event.preventDefault();
			search.open = !search.open;
		}
	}

	$effect(() => {
		if (search.open && !dialog.open) {
			query = '';
			active = 0;
			dialog.showModal();
		} else if (!search.open && dialog.open) {
			dialog.close();
		}
	});

	$effect(() => {
		const entry = results[active];
		if (entry) document.getElementById(optionId(entry))?.scrollIntoView({ block: 'nearest' });
	});
</script>

<svelte:window onkeydown={onglobalkeydown} />

<!-- Clicking the backdrop closes; Escape is handled natively by <dialog>. -->
<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog
	bind:this={dialog}
	aria-label="Search spinners"
	onclose={() => (search.open = false)}
	onclick={(event) => {
		if (event.target === dialog) search.open = false;
	}}
	class="mx-auto mt-[14vh] w-[min(32rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-neutral-200/70 bg-white p-0 text-neutral-950 shadow-2xl shadow-neutral-950/10 backdrop:bg-neutral-950/15"
>
	<div class="flex items-center gap-2.5 border-b border-neutral-100 px-4 text-neutral-400">
		<Icon name="search" size={16} />
		<input
			type="text"
			role="combobox"
			aria-expanded="true"
			aria-controls="{id}-list"
			aria-autocomplete="list"
			aria-activedescendant={results[active] ? optionId(results[active]) : undefined}
			placeholder="Search spinners"
			spellcheck="false"
			autocomplete="off"
			class="h-12 flex-1 bg-transparent text-[15px] text-neutral-950 outline-none placeholder:text-neutral-400"
			bind:value={query}
			oninput={() => (active = 0)}
			{onkeydown}
		/>
		<kbd class="rounded border border-neutral-200 px-1.5 py-0.5 font-sans text-[11px]">Esc</kbd>
	</div>

	<ul id="{id}-list" role="listbox" aria-label="Spinners" class="max-h-80 overflow-y-auto p-1.5">
		{#each results as entry, i (entry.slug)}
			{@const Spinner = componentOf(entry)}
			<!-- Keyboard selection lives on the combobox input, per the ARIA pattern. -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<li
				id={optionId(entry)}
				role="option"
				aria-selected={i === active}
				class="flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 aria-selected:bg-neutral-100"
				onpointermove={() => (active = i)}
				onclick={() => choose(entry)}
			>
				<span
					class="grid size-8 shrink-0 place-items-center rounded-md border border-neutral-100 bg-white"
				>
					<Spinner size={16} />
				</span>
				<span class="min-w-0">
					<span class="block text-sm">{entry.name}</span>
					<span class="block truncate text-xs text-neutral-500">{entry.description}</span>
				</span>
			</li>
		{:else}
			<li class="px-3 py-8 text-center text-sm text-neutral-500">
				No spinners match “{query}”.
			</li>
		{/each}
	</ul>
</dialog>
