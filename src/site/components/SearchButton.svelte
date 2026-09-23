<script lang="ts">
	import { onMount } from 'svelte';
	import { search } from '$site/search.svelte';
	import Icon from './Icon.svelte';

	let { compact = false }: { compact?: boolean } = $props();

	// The shortcut hint depends on the platform, so it only appears once that's known.
	let shortcut = $state<string>();
	onMount(() => {
		shortcut = /Mac|iPhone|iPad/.test(navigator.userAgent) ? '⌘K' : 'Ctrl K';
	});
</script>

{#if compact}
	<button
		type="button"
		aria-label="Search spinners"
		class="grid size-8 place-items-center rounded-md text-neutral-500 transition-[color,background-color,scale] duration-150 ease-out hover:bg-neutral-100 hover:text-neutral-900 active:scale-95"
		onclick={() => (search.open = true)}
	>
		<Icon name="search" size={16} />
	</button>
{:else}
	<button
		type="button"
		class="flex h-8 w-full items-center gap-2 rounded-lg border border-neutral-200/70 bg-white px-2.5 text-neutral-500 transition-[color,border-color,scale] duration-150 ease-out hover:border-neutral-300 hover:text-neutral-900 active:scale-[0.98]"
		onclick={() => (search.open = true)}
	>
		<Icon name="search" size={14} />
		Search
		{#if shortcut}
			<kbd class="ml-auto font-sans text-[11px] text-neutral-400">{shortcut}</kbd>
		{/if}
	</button>
{/if}
