<script lang="ts">
	import { componentOf, type Entry } from '$site/catalog';
	import { ROW_CLASS, snippet, type Props } from '$site/snippet';
	import Code from './Code.svelte';

	let { entry, elements }: { entry: Entry; elements: Props[] } = $props();

	const Spinner = $derived(componentOf(entry));
	const lines = $derived(snippet(entry.importName, elements));
</script>

<figure class="overflow-hidden rounded-2xl border border-neutral-100">
	<div class="grid h-40 place-items-center bg-neutral-50/60">
		<!-- The same wrapper the snippet shows, so the preview is exactly what the code renders. -->
		<div class={ROW_CLASS}>
			{#each elements as props, i (i)}
				<Spinner {...props} />
			{/each}
		</div>
	</div>
	<Code {lines} />
</figure>
