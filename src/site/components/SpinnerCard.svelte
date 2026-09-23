<script lang="ts">
	import { resolve } from '$app/paths';
	import { componentOf, type Entry } from '$site/catalog';

	let { entry }: { entry: Entry } = $props();

	const Spinner = $derived(componentOf(entry));
</script>

<a
	href={resolve(`/spinners/${entry.slug}`)}
	class="flex aspect-square flex-col items-center rounded-2xl border border-neutral-100 bg-neutral-50/60 p-3 transition-[background-color,border-color,scale] duration-150 ease-out hover:border-neutral-200/70 hover:bg-neutral-100/60 active:scale-[0.98]"
>
	<span class="grid flex-1 place-items-center"><Spinner size={20} /></span>
	<span class="text-[13px] text-neutral-600">{entry.name}</span>
</a>
