<!--
	Browse: every spinner by itself, side by side at one size and color, each linking to its
	page. Built from the catalog, so a new spinner shows up here on its own.
-->
<script lang="ts">
	import { resolve } from '$app/paths';
	import { catalog, componentOf, entryOf } from '$site/catalog';
	import Icon from '$site/components/Icon.svelte';
	import Meta from '$site/components/Meta.svelte';
	import Segmented from '$site/components/Segmented.svelte';
	import Swatches from '$site/components/Swatches.svelte';

	// Spark is the library's own mark, so it leads; the rest follow in catalog order.
	const entries = [entryOf('spark'), ...catalog.filter((entry) => entry.slug !== 'spark')];

	const sizes = [
		{ value: 'small', label: 'Small', px: 24 },
		{ value: 'medium', label: 'Medium', px: 40 },
		{ value: 'large', label: 'Large', px: 64 }
	] as const;

	const colors = [
		{ value: '#262626', label: 'Ink' },
		{ value: '#ff3e00', label: 'Orange' },
		{ value: '#2563eb', label: 'Blue' },
		{ value: '#16a34a', label: 'Green' },
		{ value: '#7c3aed', label: 'Violet' }
	] as const;

	const defaults = { size: 'medium' as (typeof sizes)[number]['value'], color: colors[0].value };
	let size = $state(defaults.size);
	let color = $state<string>(defaults.color);
	const px = $derived(sizes.find((s) => s.value === size)!.px);
	const pristine = $derived(size === defaults.size && color === defaults.color);
</script>

<Meta title="Browse — loadsv" description="All {catalog.length} loadsv spinners, side by side." />

<div class="mx-auto max-w-[70rem] px-6">
	<section class="pt-14 pb-10 sm:pt-20">
		<h1 class="max-w-xl text-[44px] leading-[1.02] font-semibold tracking-[-0.035em] text-balance">
			Every spinner, side by side.
		</h1>
		<p class="mt-4 max-w-md text-[16px] leading-relaxed text-pretty text-neutral-600">
			All {catalog.length} at once. Change their size and color here, or open one to tune its speed.
		</p>

		<div class="mt-8 flex flex-wrap items-center gap-2">
			<div class="w-52">
				<Segmented label="Size" options={sizes} bind:value={size} />
			</div>
			<Swatches label="Color" options={colors} bind:value={color} />
			<button
				type="button"
				class="flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs text-neutral-500 transition-[color,background-color,scale,opacity] duration-150 ease-out hover:bg-neutral-100 hover:text-neutral-900 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-0"
				disabled={pristine}
				onclick={() => {
					size = defaults.size;
					color = defaults.color;
				}}
			>
				<Icon name="reset" size={12} /> Reset
			</button>
		</div>
	</section>

	<ul class="grid grid-cols-2 gap-x-4 gap-y-7 pb-24 sm:grid-cols-3 lg:grid-cols-4" style:color>
		{#each entries as entry (entry.slug)}
			{@const Spinner = componentOf(entry)}
			<li>
				<a href={resolve('/(docs)/spinners/[slug]', { slug: entry.slug })} class="group block">
					<div
						class="grid aspect-[4/3] place-items-center rounded-2xl bg-neutral-50 ring-1 ring-neutral-200/60 transition-[box-shadow,scale] duration-150 ease-out ring-inset group-hover:ring-neutral-300 group-active:scale-[0.99]"
					>
						<Spinner size={px} />
					</div>
					<p class="mt-2.5 px-1 text-[13px] font-medium text-neutral-900">{entry.name}</p>
				</a>
			</li>
		{/each}
	</ul>
</div>
