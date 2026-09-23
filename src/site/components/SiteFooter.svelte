<script lang="ts">
	import { resolve } from '$app/paths';
	import { GITHUB_URL, INSPIRATION_URL, NPM_URL } from '$site/links';
</script>

<footer class="border-t border-neutral-100 bg-neutral-50/60">
	<div
		class="mx-auto flex max-w-[70rem] flex-col gap-3 px-6 pt-8 pb-10 text-[13px] text-neutral-500 sm:flex-row sm:items-center sm:justify-between"
	>
		<p>
			Made with care for Svelte. Inspired by
			<a
				href={INSPIRATION_URL}
				rel="external"
				class="text-neutral-700 underline decoration-neutral-300 underline-offset-2 hover:decoration-current"
				>loading.dev</a
			>.
		</p>
		<ul class="flex gap-4">
			<li><a href={GITHUB_URL} rel="external" class="hover:text-neutral-950">GitHub</a></li>
			<li><a href={NPM_URL} rel="external" class="hover:text-neutral-950">npm</a></li>
			<li><a href={resolve('/llms.txt')} class="hover:text-neutral-950">llms.txt</a></li>
		</ul>
	</div>
</footer>
