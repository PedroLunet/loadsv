<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { Ring } from '$lib';

	const missing = $derived(page.status === 404);
</script>

<svelte:head>
	<title>{missing ? 'Not found' : 'Error'} — loadsv</title>
</svelte:head>

<div class="mx-auto flex max-w-xl flex-col items-start">
	<!-- A spinner that never gets going: the page it was waiting for doesn't exist. -->
	<Ring size={28} playState="paused" class="text-neutral-300" />
	<h1 class="mt-6 text-[28px] leading-[1.1] font-medium tracking-[-0.02em]">
		<span class="text-neutral-400">{page.status}/</span><br />
		{missing ? 'Nothing to load here.' : 'Something went wrong.'}
	</h1>
	<p class="mt-4 text-[15px] leading-relaxed text-neutral-600">
		{missing ? 'This page doesn’t exist, or it moved.' : page.error?.message}
	</p>
	<a
		href={resolve('/')}
		class="mt-8 rounded-lg bg-neutral-950 px-3.5 py-2 text-sm text-white transition-[background-color,scale] duration-150 ease-out hover:bg-neutral-800 active:scale-[0.97]"
	>
		Browse all spinners
	</a>
</div>
