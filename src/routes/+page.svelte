<script lang="ts">
	import { catalog } from '$site/catalog';
	import CopyButton from '$site/components/CopyButton.svelte';
	import SpinnerCard from '$site/components/SpinnerCard.svelte';

	const install = 'npm install loadsv';
</script>

<svelte:head>
	<title>loadsv — Loading indicators for Svelte</title>
	<meta
		name="description"
		content="A lightweight library of beautiful loading indicators for Svelte."
	/>
</svelte:head>

<div class="mx-auto max-w-xl">
	<h1 class="text-[28px] leading-[1.1] font-medium tracking-[-0.02em] text-balance">
		Loading,<br /><span class="text-neutral-400">made for Svelte.</span>
	</h1>
	<p class="mt-4 text-[15px] leading-relaxed text-neutral-600">
		A lightweight library of beautiful loading indicators for Svelte.
	</p>

	<div
		class="mt-8 flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50/60 py-1.5 pr-1.5 pl-4 font-mono text-[13px]"
	>
		<code><span class="mr-2 text-neutral-400 select-none">$</span>npm install <span class="text-svelte">loadsv</span></code>
		<CopyButton text={install} label="Copy install command" />
	</div>

	<ul class="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
		{#each catalog as entry (entry.slug)}
			<li><SpinnerCard {entry} /></li>
		{/each}
	</ul>
</div>
