<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { Ring } from '$lib';
	import SiteFooter from '$site/components/SiteFooter.svelte';
	import SiteHeader from '$site/components/SiteHeader.svelte';

	const missing = $derived(page.status === 404);
</script>

<svelte:head>
	<title>{missing ? 'Not found' : 'Error'} — loadsv</title>
</svelte:head>

<!-- Errors render outside every route group, so this page brings the views' frame itself. -->
<div class="flex min-h-dvh flex-col">
	<SiteHeader />
	<main id="content" class="flex-1 px-6 pt-20 pb-32 sm:pt-28">
		<div class="mx-auto flex max-w-[34rem] flex-col items-center text-center">
			<!-- A spinner that never gets going: the page it was waiting for doesn't exist. -->
			<Ring size={28} playState="paused" class="text-neutral-300" />
			<p class="mt-6 font-mono text-[13px] text-neutral-400">{page.status}</p>
			<h1 class="mt-1 text-[32px] leading-[1.1] font-semibold tracking-[-0.03em]">
				{missing ? 'Nothing to load here.' : 'Something went wrong.'}
			</h1>
			<p class="mt-3 text-[15px] leading-relaxed text-neutral-600">
				{missing ? 'This page doesn’t exist, or it moved.' : page.error?.message}
			</p>
			<a
				href={resolve('/browse')}
				class="mt-8 flex h-10 items-center rounded-[10px] bg-neutral-950 px-4 text-[14px] font-medium text-white transition-[background-color,scale] duration-150 ease-out hover:bg-neutral-800 active:scale-[0.97]"
			>
				Browse all spinners
			</a>
		</div>
	</main>
	<SiteFooter />
</div>
