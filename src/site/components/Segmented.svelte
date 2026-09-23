<!-- A radio group styled as a segmented control: arrow keys and screen readers work natively. -->
<script lang="ts" generics="T extends string">
	let {
		label,
		options,
		value = $bindable()
	}: { label: string; options: readonly { value: T; label: string }[]; value: T } = $props();

	const name = $props.id();
</script>

<fieldset>
	<legend class="sr-only">{label}</legend>
	<div class="grid auto-cols-fr grid-flow-col gap-0.5 rounded-lg bg-neutral-100 p-0.5">
		{#each options as option (option.value)}
			<label
				class="grid h-7 cursor-pointer place-items-center rounded-md text-xs text-neutral-500 transition-[color,background-color,box-shadow] duration-150 hover:text-neutral-900 has-checked:bg-white has-checked:text-neutral-950 has-checked:shadow-xs has-focus-visible:outline-2 has-focus-visible:outline-svelte"
			>
				<input type="radio" class="sr-only" {name} value={option.value} bind:group={value} />
				{option.label}
			</label>
		{/each}
	</div>
</fieldset>
