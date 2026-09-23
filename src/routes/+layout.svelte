<script lang="ts">
	import './layout.css';
	import SearchDialog from '$site/components/SearchDialog.svelte';

	// Each route group brings its own frame: (docs) has the sidebar, (views) the header and dock.
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

{@render children()}

<SearchDialog />
