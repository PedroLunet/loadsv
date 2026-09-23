<!--
	One spinner in the piece of UI it suits best. The scene is illustration only; the caption
	names the link.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { resolve } from '$app/paths';
	import type { SpinnerName } from '$lib/motion.js';
	import { entryOf } from '$site/catalog';

	let {
		slug,
		context,
		span = 2,
		children
	}: { slug: SpinnerName; context: string; span?: 2 | 3 | 4; children: Snippet } = $props();

	const spans = {
		2: 'lg:col-span-2',
		3: 'sm:col-span-2 lg:col-span-3',
		4: 'sm:col-span-2 lg:col-span-4'
	};

	const name = $derived(entryOf(slug).name);
</script>

<li class={spans[span]}>
	<a href={resolve(`/spinners/${slug}`)} class="group block">
		<div
			aria-hidden="true"
			class="relative grid h-52 place-items-center overflow-hidden rounded-2xl bg-neutral-50 px-6 ring-1 ring-neutral-200/60 transition-[box-shadow,scale] duration-150 ease-out ring-inset group-hover:ring-neutral-300 group-active:scale-[0.99]"
		>
			{@render children()}
		</div>
		<div class="mt-2.5 flex items-baseline justify-between gap-3 px-1 text-[13px]">
			<span class="font-medium text-neutral-900">{name}</span>
			<span class="truncate text-neutral-400">{context}</span>
		</div>
	</a>
</li>
