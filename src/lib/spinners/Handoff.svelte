<!--
	@component
	Two slanted pills that tuck together as they turn over, then fan back out.
-->
<script lang="ts">
	import Root from '../internal/Root.svelte';
	import { durations } from '../motion.js';
	import type { SpinnerProps } from '../types.js';

	let props: SpinnerProps = $props();
</script>

<Root name="handoff" defaultDuration={durations.handoff} {...props}>
	<span class="turn">
		<span class="axis">
			<span class="pill" style:--dir={1} style:--y={6.5}></span>
			<span class="pill" style:--dir={-1} style:--y={13}></span>
		</span>
	</span>
</Root>

<style>
	.turn,
	.axis {
		position: absolute;
		inset: 0;
	}

	/* The pair leans like a slash. */
	.axis {
		transform: rotate(-55deg);
	}

	/* Pills 13 long and 4.5 thick, side by side, staggered 3 along their length. */
	.pill {
		position: absolute;
		left: calc(5.5 / 24 * 100%);
		top: calc(var(--y) / 24 * 100%);
		width: calc(13 / 24 * 100%);
		height: calc(4.5 / 24 * 100%);
		border-radius: 999px;
		background: currentColor;
		transform: translateX(calc(var(--dir) * 3 / 13 * 100%));
	}

	.turn,
	.pill {
		animation-duration: var(--_duration);
		animation-iteration-count: infinite;
		animation-play-state: var(--_play-state);
	}

	.turn {
		animation-name: turn;
	}

	.pill {
		animation-name: tuck;
	}

	/* Half a turn, a beat of rest, half a turn: it lands on itself each time. */
	@keyframes turn {
		0%,
		15% {
			transform: rotate(0);
			animation-timing-function: cubic-bezier(0.65, 0, 0.35, 1);
		}
		50%,
		65% {
			transform: rotate(0.5turn);
			animation-timing-function: cubic-bezier(0.65, 0, 0.35, 1);
		}
		100% {
			transform: rotate(1turn);
		}
	}

	/* Like a skater pulling their arms in: fully tucked at the fastest point of the turn. */
	@keyframes tuck {
		0%,
		15%,
		50%,
		65%,
		100% {
			transform: translateX(calc(var(--dir) * 3 / 13 * 100%));
			animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1);
		}
		32.5%,
		82.5% {
			transform: none;
			animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.turn,
		.pill {
			animation-play-state: paused;
		}
	}
</style>
