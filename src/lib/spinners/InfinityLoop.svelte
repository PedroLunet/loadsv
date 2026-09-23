<!--
	@component
	A bead running a figure-eight along a faint track.
-->
<script lang="ts" module>
	/**
	 * The track: x = 8·cos t, y = 4.5·sin 2t around the center. The bead's two animations
	 * trace exactly this curve, so drawing it from the same equation keeps them together.
	 */
	const track =
		Array.from({ length: 64 }, (_, i) => {
			const t = (i / 64) * 2 * Math.PI;
			const x = 12 + 8 * Math.cos(t);
			const y = 12 + 4.5 * Math.sin(2 * t);
			return `${i ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`;
		}).join('') + 'Z';
</script>

<script lang="ts">
	import Root from '../internal/Root.svelte';
	import { durations } from '../motion.js';
	import type { SpinnerProps } from '../types.js';

	let props: SpinnerProps = $props();
</script>

<Root name="infinity-loop" defaultDuration={durations['infinity-loop']} {...props}>
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-opacity="0.2"
		stroke-linejoin="round"
	>
		<path d={track} />
	</svg>
	<!-- Two nested moves: across once per loop, up and down twice. Together they draw the eight. -->
	<span class="lsv-infinity-x"><span class="lsv-infinity-y"></span></span>
</Root>

<style>
	svg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.lsv-infinity-x {
		position: absolute;
		top: 39.6%;
		left: 39.6%;
		width: 20.8%;
		height: 20.8%;
		/* Sine easing on an alternating sweep is exactly a cosine, so the bead stays on the track. */
		animation: sway calc(var(--_duration) / 2) cubic-bezier(0.37, 0, 0.63, 1) infinite alternate;
		animation-play-state: var(--_play-state);
	}

	.lsv-infinity-y {
		display: block;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background: currentColor;
		animation: bob calc(var(--_duration) / 4) cubic-bezier(0.37, 0, 0.63, 1) infinite alternate;
		/* Half a sweep in, so it starts level and heading down, as the curve does. */
		animation-delay: calc(var(--_duration) / -8);
		animation-play-state: var(--_play-state);
	}

	@keyframes sway {
		from {
			transform: translateX(calc(var(--lsv-size) / 3));
		}
		to {
			transform: translateX(calc(var(--lsv-size) / -3));
		}
	}

	@keyframes bob {
		from {
			transform: translateY(calc(var(--lsv-size) * -0.1875));
		}
		to {
			transform: translateY(calc(var(--lsv-size) * 0.1875));
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.lsv-infinity-x,
		.lsv-infinity-y {
			animation-play-state: paused;
		}
	}
</style>
