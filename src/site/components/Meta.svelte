<!--
	@component
	A page's title and description, repeated for link previews, with its canonical URL.
	The image and card type every page shares live in the root layout.
-->
<script lang="ts">
	import { page } from '$app/state';
	import { SITE_URL } from '$site/links';

	let { title, description }: { title: string; description: string } = $props();

	const url = $derived(new URL(page.url.pathname, SITE_URL).href);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
</svelte:head>
