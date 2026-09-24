<!--
	@component
	Three pills in an S, flowing into its mirror and back like a ribbon.
-->
<script lang="ts">
	import Root from '../internal/Root.svelte';
	import { durations } from '../motion.js';
	import type { SpinnerProps } from '../types.js';

	let props: SpinnerProps = $props();
</script>

<Root name="ribbon" defaultDuration={durations.ribbon} {...props}>
	{#each { length: 3 }, i (i)}
		<span style:--i={i}></span>
	{/each}
</Root>

<style>
	/*
	 * Pills 14 wide and 3.6 thick, 6 apart. Each sways 3 either side of centre, a quarter
	 * loop behind the one above, so a wave runs down the stack. At rest the top leans right
	 * and the bottom left: the three strokes of an S.
	 */
	span {
		position: absolute;
		left: calc(5 / 24 * 100%);
		top: calc((6 + var(--i) * 6 - 1.8) / 24 * 100%);
		width: calc(14 / 24 * 100%);
		height: calc(3.6 / 24 * 100%);
		border-radius: 999px;
		background: currentColor;
		animation: sway var(--_duration) cubic-bezier(0.37, 0, 0.63, 1) infinite;
		animation-delay: calc(var(--_duration) * (var(--i) / 4 - 1));
		animation-play-state: var(--_play-state);
	}

	@keyframes sway {
		0%,
		100% {
			transform: translateX(calc(3 / 14 * 100%));
		}
		50% {
			transform: translateX(calc(-3 / 14 * 100%));
		}
	}

	@media (prefers-reduced-motion: reduce) {
		span {
			animation-play-state: paused;
		}
	}
</style>
