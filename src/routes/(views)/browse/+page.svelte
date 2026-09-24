<!--
	Browse: every spinner by itself, side by side at one size and color, each linking to its
	page. Built from the catalog, so a new spinner shows up here on its own.
-->
<script lang="ts">
	import { resolve } from '$app/paths';
	import { catalog, componentOf, entryOf } from '$site/catalog';

	// Spark is the library's own mark, so it leads; the rest follow in catalog order.
	const entries = [entryOf('spark'), ...catalog.filter((entry) => entry.slug !== 'spark')];
</script>

<svelte:head>
	<title>Browse — loadsv</title>
	<meta name="description" content="All {catalog.length} loadsv spinners, side by side." />
</svelte:head>

<div class="mx-auto max-w-[70rem] px-6">
	<section class="pt-14 pb-14 sm:pt-20">
		<h1 class="max-w-xl text-[44px] leading-[1.02] font-semibold tracking-[-0.035em] text-balance">
			Every spinner, side by side.
		</h1>
		<p class="mt-4 max-w-md text-[16px] leading-relaxed text-pretty text-neutral-600">
			All {catalog.length} at the same size. Open one to set its size, color and speed.
		</p>
	</section>

	<ul class="grid grid-cols-2 gap-x-4 gap-y-7 pb-24 sm:grid-cols-3 lg:grid-cols-4">
		{#each entries as entry (entry.slug)}
			{@const Spinner = componentOf(entry)}
			<li>
				<a href={resolve('/(docs)/spinners/[slug]', { slug: entry.slug })} class="group block">
					<div
						class="grid aspect-[4/3] place-items-center rounded-2xl bg-neutral-50 text-neutral-800 ring-1 ring-neutral-200/60 transition-[box-shadow,scale] duration-150 ease-out ring-inset group-hover:ring-neutral-300 group-active:scale-[0.99]"
					>
						<Spinner size={40} />
					</div>
					<p class="mt-2.5 px-1 text-[13px] font-medium text-neutral-900">{entry.name}</p>
				</a>
			</li>
		{/each}
	</ul>
</div>
