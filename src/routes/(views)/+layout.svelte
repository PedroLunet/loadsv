<script lang="ts">
	import SiteFooter from '$site/components/SiteFooter.svelte';
	import SiteHeader from '$site/components/SiteHeader.svelte';
	import ViewDock from '$site/components/ViewDock.svelte';

	let { children } = $props();
</script>

<div class="flex min-h-dvh flex-col">
	<SiteHeader />
	<main id="content" class="flex-1">
		{@render children()}
	</main>
	<ViewDock />
	<SiteFooter />
</div>
