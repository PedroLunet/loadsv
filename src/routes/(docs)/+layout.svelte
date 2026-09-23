<script lang="ts">
	import { resolve } from '$app/paths';
	import { GITHUB_URL, INSPIRATION_URL, NPM_URL } from '$site/links';
	import Logo from '$site/components/Logo.svelte';
	import SearchButton from '$site/components/SearchButton.svelte';
	import Sidebar from '$site/components/Sidebar.svelte';

	let { children } = $props();
</script>

<div class="min-h-dvh lg:grid lg:grid-cols-[232px_minmax(0,1fr)]">
	<Sidebar />

	<div class="min-w-0">
		<header
			class="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-100 bg-white/80 px-3 py-2.5 backdrop-blur-md lg:hidden"
		>
			<Logo />
			<SearchButton compact />
		</header>

		<main id="content" class="px-5 pt-12 pb-24 sm:px-8 lg:pt-16">
			{@render children()}
		</main>

		<!-- The sidebar carries these links on large screens. -->
		<footer class="px-5 pb-10 text-[13px] text-neutral-500 sm:px-8 lg:hidden">
			<div class="mx-auto flex max-w-xl flex-col gap-3 border-t border-neutral-100 pt-6">
				<ul class="flex gap-4">
					<li><a href={GITHUB_URL} rel="external" class="hover:text-neutral-950">GitHub</a></li>
					<li><a href={NPM_URL} rel="external" class="hover:text-neutral-950">npm</a></li>
					<li><a href={resolve('/llms.txt')} class="hover:text-neutral-950">llms.txt</a></li>
				</ul>
				<p class="text-xs">
					Made with care for Svelte. Inspired by
					<a
						href={INSPIRATION_URL}
						rel="external"
						class="text-neutral-700 underline decoration-neutral-300 underline-offset-2 hover:decoration-current"
						>loading.dev</a
					>.
				</p>
			</div>
		</footer>
	</div>
</div>
