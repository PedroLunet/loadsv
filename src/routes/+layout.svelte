<script lang="ts">
	import './layout.css';
	import { SITE_URL } from '$site/links';
	import SearchDialog from '$site/components/SearchDialog.svelte';

	// Each route group brings its own frame: (docs) has the sidebar, (views) the header and dock.
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
	<!-- Link previews. Each page adds its own title, description and URL through <Meta>. -->
	<meta property="og:site_name" content="loadsv" />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="{SITE_URL}/og.png" />
	<meta property="og:image:width" content="2400" />
	<meta property="og:image:height" content="1260" />
	<meta property="og:image:alt" content="loadsv: loading indicators for Svelte" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<a
	href="#content"
	class="sr-only rounded-md bg-white px-3 py-2 text-sm shadow focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
>
	Skip to content
</a>

{@render children()}

<SearchDialog />
