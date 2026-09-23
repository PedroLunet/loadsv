<script lang="ts">
	import { GITHUB_URL, NPM_URL } from '$site/links';
	import Icon from './Icon.svelte';
	import Logo from './Logo.svelte';
	import SearchButton from './SearchButton.svelte';

	const link =
		'grid size-8 place-items-center rounded-md text-neutral-500 transition-[color,background-color,scale] duration-150 ease-out hover:bg-neutral-100 hover:text-neutral-900 active:scale-95';
</script>

<header class="mx-auto flex h-16 w-full max-w-[70rem] items-center justify-between gap-4 px-6">
	<div class="-ml-2"><Logo /></div>
	<div class="flex items-center gap-1 text-[13px]">
		<div class="mr-1 hidden w-44 sm:block"><SearchButton /></div>
		<div class="sm:hidden"><SearchButton compact /></div>
		<a href={GITHUB_URL} rel="external" aria-label="GitHub" class={link}>
			<Icon name="github" size={16} />
		</a>
		<a href={NPM_URL} rel="external" aria-label="npm" class={link}>
			<Icon name="npm" size={16} />
		</a>
	</div>
</header>
