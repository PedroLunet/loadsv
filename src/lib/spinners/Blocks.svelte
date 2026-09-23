<!--
	@component
	Nine blocks shrinking and growing in a sweep across a grid.
-->
<script lang="ts">
	import Root from '../internal/Root.svelte';
	import { durations } from '../motion.js';
	import type { SpinnerProps } from '../types.js';

	let props: SpinnerProps = $props();
</script>

<Root name="blocks" defaultDuration={durations.blocks} {...props}>
	{#each { length: 9 }, i (i)}
		<span style:--row={Math.floor(i / 3)} style:--col={i % 3}></span>
	{/each}
</Root>

<style>
	span {
		position: absolute;
		top: calc(6.25% + var(--row) * 31.25%);
		left: calc(6.25% + var(--col) * 31.25%);
		width: 25%;
		height: 25%;
		border-radius: 16%;
		background: currentColor;
		animation: shrink var(--_duration) cubic-bezier(0.65, 0, 0.35, 1) infinite;
		/* Blocks on the same diagonal move together, so the sweep runs corner to corner. */
		animation-delay: calc(var(--_duration) * ((var(--row) + var(--col)) / 10 - 1));
		animation-play-state: var(--_play-state);
	}

	@keyframes shrink {
		0%,
		60%,
		100% {
			transform: scale(1);
		}
		30% {
			transform: scale(0.2);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		span {
			animation-play-state: paused;
		}
	}
</style>
