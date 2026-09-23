<script lang="ts">
	import { resolve } from '$app/paths';
	import { neighbours } from '$site/catalog';
	import CopyButton from '$site/components/CopyButton.svelte';
	import Demo from '$site/components/Demo.svelte';
	import Playground from '$site/components/Playground.svelte';
	import Prose from '$site/components/Prose.svelte';
	import Toc from '$site/components/Toc.svelte';
	import { sections } from '$site/docs';
	import { markdownPath, spinnerMarkdown } from '$site/markdown';

	let { data } = $props();

	const entry = $derived(data.entry);
	const content = $derived(sections(entry));
	const [previous, next] = $derived(neighbours(entry));
	const toc = $derived([{ id: 'preview', title: 'Preview' }, ...content]);
</script>

<svelte:head>
	<title>{entry.name} — loadsv</title>
	<meta name="description" content={entry.description} />
	<link rel="alternate" type="text/markdown" href={markdownPath(entry)} />
</svelte:head>

<div class="xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(0,36rem)_minmax(0,1fr)] xl:gap-10">
	<article class="mx-auto max-w-xl xl:col-start-2 xl:w-full">
		<header>
			<h1 class="text-[28px] leading-[1.1] font-medium tracking-[-0.02em]">
				<span class="text-neutral-400">Component/</span><br />{entry.name}
			</h1>
			<p class="mt-4 text-[15px] leading-relaxed text-neutral-600">{entry.description}</p>
		</header>

		<section id="preview" class="mt-8 scroll-mt-20" aria-label="Preview">
			<!-- Keyed so every spinner starts from its own defaults. -->
			{#key entry.slug}
				<Playground {entry} />
			{/key}
		</section>

		{#each content as section (section.id)}
			<section id={section.id} class="mt-14 scroll-mt-20">
				<h2 class="text-[17px] font-medium tracking-[-0.01em]">{section.title}</h2>
				<p class="mt-2 text-sm leading-relaxed text-pretty text-neutral-600">
					<Prose text={section.body} />
				</p>
				{#if section.demo}
					<div class="mt-5"><Demo {entry} elements={section.demo} /></div>
				{/if}
			</section>
		{/each}

		<nav aria-label="Other spinners" class="mt-16 grid grid-cols-2 gap-2 text-sm">
			<a
				href={resolve('/spinners/[slug]', { slug: previous.slug })}
				class="rounded-xl border border-neutral-100 px-4 py-3 transition-[background-color,scale] duration-150 ease-out hover:bg-neutral-50 active:scale-[0.98]"
			>
				<span class="block text-xs text-neutral-500">Previous</span>
				<span class="font-medium">{previous.name}</span>
			</a>
			<a
				href={resolve('/spinners/[slug]', { slug: next.slug })}
				class="rounded-xl border border-neutral-100 px-4 py-3 text-right transition-[background-color,scale] duration-150 ease-out hover:bg-neutral-50 active:scale-[0.98]"
			>
				<span class="block text-xs text-neutral-500">Next</span>
				<span class="font-medium">{next.name}</span>
			</a>
		</nav>
	</article>

	<aside class="hidden xl:block">
		<div class="sticky top-16 flex flex-col gap-3">
			<CopyButton text={() => spinnerMarkdown(entry)} class="self-start">Copy page</CopyButton>
			<Toc items={toc} />
		</div>
	</aside>
</div>
