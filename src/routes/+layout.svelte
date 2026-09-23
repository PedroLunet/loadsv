<script lang="ts">
	import './layout.css';
	import Logo from '$site/components/Logo.svelte';
	import Sidebar from '$site/components/Sidebar.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
</svelte:head>

<a
	href="#content"
	class="sr-only rounded-md bg-white px-3 py-2 text-sm shadow focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
>
	Skip to content
</a>

<div class="min-h-dvh lg:grid lg:grid-cols-[232px_minmax(0,1fr)]">
	<Sidebar />

	<div class="min-w-0">
		<header
			class="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-100 bg-white/80 px-3 py-2.5 backdrop-blur-md lg:hidden"
		>
			<Logo />
		</header>

		<main id="content" class="px-5 pt-12 pb-24 sm:px-8 lg:pt-16">
			{@render children()}
		</main>
	</div>
</div>
