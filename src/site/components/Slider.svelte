<!-- A native range input stretched over a labelled track, so the whole row is draggable. -->
<script lang="ts">
	let {
		label,
		min,
		max,
		step = 1,
		value = $bindable(),
		format = String
	}: {
		label: string;
		min: number;
		max: number;
		step?: number;
		value: number;
		format?: (value: number) => string;
	} = $props();

	const progress = $derived((value - min) / (max - min));
</script>

<label
	class="relative flex h-7 items-center justify-between overflow-hidden rounded-lg bg-neutral-100 px-2.5 text-xs has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-svelte"
>
	<!-- Tracks the pointer 1:1, so no transition: any easing here would feel like lag. -->
	<span
		class="absolute inset-0 origin-left bg-neutral-200/80"
		style:transform="scaleX({progress})"
	></span>
	<span class="relative text-neutral-600">{label}</span>
	<span class="relative text-neutral-500 tabular-nums">{format(value)}</span>
	<input
		type="range"
		class="absolute inset-0 cursor-ew-resize opacity-0"
		{min}
		{max}
		{step}
		aria-valuetext={format(value)}
		bind:value
	/>
</label>
