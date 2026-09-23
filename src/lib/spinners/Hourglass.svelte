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
	The two heaps of sand are exact mirror images, so once the glass has turned over, the
	full bottom looks just like the full top: the loop restarts without a visible jump.
-->
<Root name="hourglass" defaultDuration={durations.hourglass} {...props}>
	<span class="lsv-hourglass-glass">
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round">
			<path d="M6 3.25H18M6 20.75H18" stroke-width="2.5" />
			<path
				d="M7.5 4.5 11.25 12 7.5 19.5M16.5 4.5 12.75 12 16.5 19.5"
				stroke-width="1.5"
				stroke-opacity="0.35"
				stroke-linejoin="round"
			/>
		</svg>
		<svg class="lsv-hourglass-top" viewBox="0 0 24 24" fill="currentColor">
			<path d="M9 5.5H15L12 11.5Z" />
		</svg>
		<svg class="lsv-hourglass-stream" viewBox="0 0 24 24" stroke="currentColor">
			<path d="M12 11.5V18.5" />
		</svg>
		<svg class="lsv-hourglass-bottom" viewBox="0 0 24 24" fill="currentColor">
			<path d="M9 18.5H15L12 12.5Z" />
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

	.lsv-hourglass-glass {
		animation: turn var(--_duration) infinite;
	}

	/* The top heap shrinks into the neck; the bottom one grows up from its base. */
	.lsv-hourglass-top {
		transform-origin: 50% 47.9%;
		animation: drain var(--_duration) infinite;
	}

	.lsv-hourglass-bottom {
		transform-origin: 50% 77.1%;
		animation: fill var(--_duration) infinite;
	}

	/* The stream shortens as the heap rises to meet it. */
	.lsv-hourglass-stream {
		transform-origin: 50% 47.9%;
		animation: pour var(--_duration) infinite;
	}

	/* After the shorthands above, which would otherwise reset these. */
	.lsv-hourglass-glass,
	.lsv-hourglass-top,
	.lsv-hourglass-bottom,
	.lsv-hourglass-stream {
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

	@keyframes pour {
		0% {
			opacity: 0;
			transform: scaleY(1);
			animation-timing-function: linear(0, 0.316 10%, 0.5 25%, 0.707 50%, 0.866 75%, 1);
		}
		3% {
			opacity: 1;
		}
		68% {
			opacity: 1;
		}
		72%,
		100% {
			opacity: 0;
			transform: scaleY(0.14);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.lsv-hourglass-glass,
		.lsv-hourglass-top,
		.lsv-hourglass-bottom,
		.lsv-hourglass-stream {
			animation-play-state: paused;
		}
	}
</style>
