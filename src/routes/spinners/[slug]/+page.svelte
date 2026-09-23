<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>{data.entry.name} — loadsv</title>
</svelte:head>

<div class="mx-auto max-w-xl">
	<h1 class="text-[28px] leading-[1.1] font-medium tracking-[-0.02em]">{data.entry.name}</h1>
</div>
