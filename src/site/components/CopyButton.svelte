<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from './Icon.svelte';

	let {
		text,
		label = 'Copy to clipboard',
		class: className = '',
		children
	}: {
		text: string | (() => string);
		/** Accessible name when there's no visible label. */
		label?: string;
		class?: string;
		/** Optional visible label, shown beside the icon. */
		children?: Snippet;
	} = $props();

	let copied = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;

	async function copy() {
		await navigator.clipboard.writeText(typeof text === 'function' ? text() : text);
		copied = true;
		clearTimeout(timer);
		timer = setTimeout(() => (copied = false), 1500);
	}
</script>

<button
	type="button"
	onclick={copy}
	aria-label={children ? undefined : label}
	class={[
		'flex shrink-0 items-center rounded-md text-neutral-400 transition-[color,background-color,scale] duration-150 ease-out hover:bg-neutral-200/60 hover:text-neutral-900 active:scale-95',
		children ? 'h-7 gap-2 px-2 text-[13px] text-neutral-500' : 'size-7 justify-center',
		className
	]}
>
	<span class="grid">
		<span class="icon" data-shown={!copied}><Icon name="copy" size={14} /></span>
		<span class="icon" data-shown={copied}><Icon name="check" size={14} /></span>
	</span>
	{@render children?.()}
	<span class="sr-only" aria-live="polite">{copied ? 'Copied' : ''}</span>
</button>

<style>
	/* Both icons share one cell; the blur blends the swap into a single change. */
	.icon {
		grid-area: 1 / 1;
		transition:
			opacity 200ms var(--ease-out),
			scale 200ms var(--ease-out),
			filter 200ms var(--ease-out);
	}

	.icon[data-shown='false'] {
		opacity: 0;
		scale: 0.6;
		filter: blur(2px);
	}

	@media (prefers-reduced-motion: reduce) {
		.icon[data-shown='false'] {
			scale: 1;
			filter: none;
		}
	}
</style>
