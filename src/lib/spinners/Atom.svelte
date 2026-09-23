<!--
	@component
	Three rings turning over inside a circle, each on its own axis.
-->
<script lang="ts">
	import Root from '../internal/Root.svelte';
	import { durations } from '../motion.js';
	import type { SpinnerProps } from '../types.js';

	let props: SpinnerProps = $props();
</script>

<Root name="atom" defaultDuration={durations.atom} {...props}>
	<span class="lsv-atom-shell"></span>
	{#each { length: 3 }, k (k)}
		<span class="lsv-atom-ring" style:--k={k}></span>
	{/each}
</Root>

<style>
	.lsv-atom-shell,
	.lsv-atom-ring {
		position: absolute;
		inset: 0;
		box-sizing: border-box;
		border: solid currentColor;
		border-radius: 50%;
	}

	.lsv-atom-shell {
		border-width: calc(var(--lsv-size) * 1.5 / 24);
	}

	/*
	 * Each ring turns over about an axis in the page, so it narrows to a line and opens
	 * out again, and each axis is tilted 60° from the last. A third of a turn apart, the
	 * widest ring sweeps round the circle, which reads as one sphere tumbling in place.
	 * `rotate` tilts the axis after `transform` turns the ring, so the tilt holds still.
	 * Thin strokes keep the rings apart as they open out against the circle.
	 */
	.lsv-atom-ring {
		border-width: calc(var(--lsv-size) * 1.25 / 24);
		rotate: calc(var(--k) * 60deg);
		animation: tumble var(--_duration) linear infinite;
		animation-delay: calc(var(--_duration) * var(--k) / -3);
		animation-play-state: var(--_play-state);
	}

	@keyframes tumble {
		from {
			transform: rotateY(0);
		}
		to {
			transform: rotateY(1turn);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.lsv-atom-ring {
			animation-play-state: paused;
		}
	}
</style>
