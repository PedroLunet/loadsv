<!--
	A color picker styled like Segmented: a radio group of presets, then a native picker for
	any other color. Choosing one there selects it; choosing a preset again moves back.
-->
<script lang="ts">
	let {
		label,
		options,
		value = $bindable()
	}: {
		label: string;
		options: readonly { value: string; label: string }[];
		value: string;
	} = $props();

	const name = $props.id();
	const custom = $derived(!options.some((option) => option.value === value));

	const cell =
		'relative grid size-7 cursor-pointer place-items-center rounded-md has-focus-visible:outline-2 has-focus-visible:outline-svelte';
</script>

<fieldset>
	<legend class="sr-only">{label}</legend>
	<div class="flex gap-0.5 rounded-lg bg-neutral-100 p-0.5">
		{#each options as option (option.value)}
			<label class="{cell} has-checked:bg-white has-checked:shadow-xs" title={option.label}>
				<input
					type="radio"
					class="sr-only"
					{name}
					value={option.value}
					aria-label={option.label}
					bind:group={value}
				/>
				<span class="dot" style:background={option.value}></span>
			</label>
		{/each}
		<label class={[cell, custom && 'bg-white shadow-xs']} title="Custom">
			<!--
				Transparent but full size, so the browser's picker opens where it was clicked. It
				opens on the current color, preset or not.
			-->
			<input
				type="color"
				class="absolute inset-0 size-full cursor-pointer opacity-0"
				aria-label="Custom color"
				{value}
				oninput={(event) => (value = event.currentTarget.value)}
			/>
			<span class={['dot', !custom && 'any']} style:background={custom ? value : undefined}></span>
		</label>
	</div>
</fieldset>

<style>
	.dot {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.1);
		pointer-events: none;
	}

	/* Any color: a hue wheel, until one is picked. */
	.any {
		background: conic-gradient(
			from 180deg,
			#ff3e00,
			#f5b700,
			#16a34a,
			#0891b2,
			#2563eb,
			#7c3aed,
			#db2777,
			#ff3e00
		);
	}
</style>
