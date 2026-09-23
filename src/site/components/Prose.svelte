<!-- Renders a sentence where `backticks` mark inline code. No HTML is ever injected. -->
<script lang="ts">
	let { text }: { text: string } = $props();

	const parts = $derived(text.split('`'));
</script>

{#each parts as part, i (i)}{#if i % 2}<code
			class="rounded-[5px] border border-neutral-200/70 bg-neutral-50 px-1 py-px text-[0.85em] text-neutral-800"
			>{part}</code
		>{:else}{part}{/if}{/each}
