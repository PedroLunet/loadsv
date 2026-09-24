<!--
	@component
	Three rings turning over inside a circle, a third of a turn at a time.
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
		animation:
			tumble var(--_duration) infinite,
			edge var(--_duration) linear infinite;
		animation-delay: calc(var(--_duration) * var(--k) / -3);
		animation-play-state: var(--_play-state);
	}

	/*
	 * A third of a turn at a time, eased in and out, then a pause. The rings are a third of a
	 * turn apart, so they all move and settle together, and each settles at the angle the
	 * next one left: the figure comes to rest as it started, turned 60°.
	 */
	@keyframes tumble {
		0% {
			transform: rotateY(0);
			animation-timing-function: cubic-bezier(0.65, 0, 0.35, 1);
		}
		33.333% {
			transform: rotateY(120deg);
			animation-timing-function: cubic-bezier(0.65, 0, 0.35, 1);
		}
		66.667% {
			transform: rotateY(240deg);
			animation-timing-function: cubic-bezier(0.65, 0, 0.35, 1);
		}
		100% {
			transform: rotateY(360deg);
		}
	}

	/*
	 * Turned nearly edge-on, a ring's sides thin to a fraction of a pixel and break up into
	 * dotted hairlines. So it fades out as it narrows past 54°, stays hidden while it's under
	 * a fifth of its width (79.2° to 100.8°), and is back by the pause at 120°; the same,
	 * mirrored, round 270°. The times are when the eased turn reaches those angles.
	 */
	@keyframes edge {
		0%,
		16.08%,
		33.333%,
		66.667%,
		83.92%,
		100% {
			opacity: 1;
		}
		18.644%,
		21.934%,
		78.066%,
		81.356% {
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.lsv-atom-ring {
			animation-play-state: paused;
		}
	}
</style>
