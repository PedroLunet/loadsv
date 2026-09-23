<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { catalog } from '$site/catalog';
	import { GITHUB_URL, INSPIRATION_URL, NPM_URL } from '$site/links';
	import Icon from './Icon.svelte';
	import Logo from './Logo.svelte';
	import SearchButton from './SearchButton.svelte';

	const current = (href: string) => (page.url.pathname === href ? 'page' : undefined);

	const item =
		'block rounded-md px-2 py-1.5 text-neutral-600 transition-colors duration-150 hover:bg-neutral-100 hover:text-neutral-950 aria-[current=page]:bg-neutral-200/60 aria-[current=page]:font-medium aria-[current=page]:text-neutral-950';
</script>

<aside
	class="sticky top-0 hidden h-dvh flex-col gap-5 overflow-y-auto border-r border-neutral-100 bg-neutral-50/70 px-3 py-4 text-[13px] lg:flex"
>
	<Logo />
	<SearchButton />

	<nav aria-label="Docs" class="flex flex-col gap-4">
		<a href={resolve('/')} class={item} aria-current={current(resolve('/'))}>Overview</a>
		<ul>
			{#each catalog as entry (entry.slug)}
				{@const href = resolve('/spinners/[slug]', { slug: entry.slug })}
				<li><a {href} class={item} aria-current={current(href)}>{entry.name}</a></li>
			{/each}
		</ul>
	</nav>

	<ul class="mt-auto">
		<li>
			<a href={GITHUB_URL} class="{item} flex items-center gap-2">
				<Icon name="github" size={14} /> GitHub
			</a>
		</li>
		<li>
			<a href={NPM_URL} class="{item} flex items-center gap-2">
				<Icon name="npm" size={14} /> npm
			</a>
		</li>
		<li>
			<a href="/llms.txt" class="{item} flex items-center gap-2">
				<Icon name="file" size={14} /> llms.txt
			</a>
		</li>
	</ul>

	<p class="border-t border-neutral-200/70 px-2 pt-4 text-xs leading-relaxed text-neutral-500">
		Made with care for Svelte. Inspired by
		<a href={INSPIRATION_URL} class="text-neutral-700 underline-offset-2 hover:underline"
			>loading.dev</a
		>.
	</p>
</aside>
