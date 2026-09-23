<!--
	@component
	An arc chasing its own tail, stretching out and shrinking back as it turns.

	The one spinner that animates more than transform and opacity: the stretch is
	`stroke-dasharray` and `stroke-dashoffset`, which repaint the arc every frame.
-->
<script lang="ts">
	import Root from '../internal/Root.svelte';
	import { durations } from '../motion.js';
	import type { Cap, SpinnerProps } from '../types.js';

	interface Props extends SpinnerProps {
		/** How the ends of the stroke are drawn. Defaults to `round`. */
		cap?: Cap;
	}

	let { cap = 'round', ...props }: Props = $props();
</script>

<Root name="snake" defaultDuration={durations.snake} {...props}>
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
		<circle cx="12" cy="12" r="9.5" stroke-linecap={cap === 'round' ? 'round' : 'butt'} />
	</svg>
</Root>

<style>
	/*
	 * The turn stays on the compositor. It runs a third slower than the stretch, so each
	 * stretch starts a quarter turn further back than the last.
	 */
	svg {
		display: block;
		width: 100%;
		height: 100%;
		animation: spin calc(var(--_duration) * 4 / 3) linear infinite;
		animation-play-state: var(--_play-state);
	}

	/* The still pose, and where the loop starts: an arc most of the way out. */
	circle {
		animation: stretch var(--_duration) cubic-bezier(0.42, 0, 0.58, 1) infinite;
		animation-delay: calc(var(--_duration) * -0.4);
		animation-play-state: var(--_play-state);
	}

	@keyframes spin {
		to {
			transform: rotate(1turn);
		}
	}

	/*
	 * Dash and gap always add up to the circumference (2π × 9.5), so the arc wraps cleanly
	 * past the circle's start and the last frame is the first, one lap on. The head races
	 * ahead while the tail lags, then the tail closes to a short sliver, so flat ends
	 * never vanish.
	 */
	@keyframes stretch {
		from {
			stroke-dasharray: 2 57.69;
			stroke-dashoffset: 0;
		}
		50% {
			stroke-dasharray: 42 17.69;
			stroke-dashoffset: -10;
		}
		to {
			stroke-dasharray: 2 57.69;
			stroke-dashoffset: -59.69;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		svg,
		circle {
			animation-play-state: paused;
		}
	}
</style>
