<script lang="ts">
	import Icon from './Icon.svelte';

	let {
		text,
		label = 'Copy to clipboard',
		class: className = ''
	}: { text: string | (() => string); label?: string; class?: string } = $props();

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
	aria-label={label}
	class="grid size-7 shrink-0 place-items-center rounded-md text-neutral-400 transition-[color,background-color,scale] duration-150 ease-out hover:bg-neutral-200/60 hover:text-neutral-900 active:scale-95 {className}"
>
	<span class="icon" data-shown={!copied}><Icon name="copy" size={14} /></span>
	<span class="icon" data-shown={copied}><Icon name="check" size={14} /></span>
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
