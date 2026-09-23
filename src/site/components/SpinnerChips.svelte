<!--
	Spinner choices as a row of pressable chips. Each chip carries the spinner's own still
	pose as its icon; the chosen one plays.
-->
<script lang="ts">
	import type { SpinnerName } from '$lib/motion.js';
	import { componentOf, entryOf } from '$site/catalog';

	let {
		label,
		options,
		value = $bindable(),
		onchange
	}: {
		label: string;
		options: readonly SpinnerName[];
		value: SpinnerName;
		onchange?: (value: SpinnerName) => void;
	} = $props();
</script>

<div role="group" aria-label={label} class="flex flex-wrap gap-1.5">
	{#each options as slug (slug)}
		{@const entry = entryOf(slug)}
		{@const Spinner = componentOf(entry)}
		{@const active = slug === value}
		<button
			type="button"
			aria-pressed={active}
			onclick={() => {
				value = slug;
				onchange?.(slug);
			}}
			class={[
				'inline-flex h-8 items-center gap-2 rounded-lg border px-2.5 text-[13px] transition-[background-color,border-color,color,scale] duration-150 ease-out active:scale-[0.97]',
				active
					? 'border-neutral-300/80 bg-neutral-100 text-neutral-950'
					: 'border-neutral-200/70 bg-white text-neutral-600 hover:border-neutral-300/80 hover:text-neutral-950'
			]}
		>
			<Spinner size={14} playState={active ? 'running' : 'paused'} />
			{entry.name}
		</button>
	{/each}
</div>
