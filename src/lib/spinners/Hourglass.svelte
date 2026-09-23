<!--
	@component
	An hourglass draining its sand, then flipping over.
-->
<script lang="ts">
	import Root from '../internal/Root.svelte';
	import { durations } from '../motion.js';
	import type { SpinnerProps } from '../types.js';

	let props: SpinnerProps = $props();
</script>

<!--
	Each heap of sand is the exact shape of its half of the glass, and the two halves are
	mirror images. Once the glass has turned over, the full bottom looks just like the full
	top, so the loop restarts without a visible jump.
-->
<Root name="hourglass" defaultDuration={durations.hourglass} {...props}>
	<span class="lsv-hourglass-glass">
		<!-- Faded as a whole, so the stroke that rounds the corners never darkens the fill. -->
		<svg class="lsv-hourglass-track" viewBox="0 0 24 24">
			<path d="M6.5 4H17.5L12 12ZM6.5 20H17.5L12 12Z" />
		</svg>
		<svg class="lsv-hourglass-top" viewBox="0 0 24 24">
			<path d="M6.5 4H17.5L12 12Z" />
		</svg>
		<svg class="lsv-hourglass-bottom" viewBox="0 0 24 24">
			<path d="M6.5 20H17.5L12 12Z" />
		</svg>
	</span>
</Root>

<style>
	.lsv-hourglass-glass,
	svg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	svg {
		fill: currentColor;
		stroke: currentColor;
		stroke-width: 2.5;
		stroke-linejoin: round;
	}

	.lsv-hourglass-track {
		opacity: 0.2;
	}

	.lsv-hourglass-glass {
		animation: turn var(--_duration) infinite;
	}

	/* The top heap shrinks into the neck; the bottom one grows up from the floor. */
	.lsv-hourglass-top {
		transform-origin: 50% 50%;
		animation: drain var(--_duration) infinite;
	}

	.lsv-hourglass-bottom {
		transform-origin: 50% 88.5%;
		animation: fill var(--_duration) infinite;
	}

	/* After the shorthands above, which would otherwise reset these. */
	.lsv-hourglass-glass,
	.lsv-hourglass-top,
	.lsv-hourglass-bottom {
		/* Starts mid-pour, so a still frame shows sand in both halves. */
		animation-delay: calc(var(--_duration) * -0.3);
		animation-play-state: var(--_play-state);
	}

	@keyframes turn {
		0%,
		72% {
			transform: rotate(0);
			animation-timing-function: cubic-bezier(0.77, 0, 0.175, 1);
		}
		100% {
			transform: rotate(0.5turn);
		}
	}

	/*
	 * Sand falls at a steady volume, and a heap's volume grows with the square of its size,
	 * so size follows a square root of time. linear() traces that curve point by point.
	 */
	@keyframes drain {
		0% {
			transform: scale(1);
			animation-timing-function: linear(0, 0.134 25%, 0.293 50%, 0.5 75%, 0.684 90%, 1);
		}
		72%,
		100% {
			transform: scale(0);
		}
	}

	@keyframes fill {
		0% {
			transform: scale(0);
			animation-timing-function: linear(0, 0.316 10%, 0.5 25%, 0.707 50%, 0.866 75%, 1);
		}
		72%,
		100% {
			transform: scale(1);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.lsv-hourglass-glass,
		.lsv-hourglass-top,
		.lsv-hourglass-bottom {
			animation-play-state: paused;
		}
	}
</style>
