<!--
	@component
	A worm inching round a rounded square, stretching round each corner, then gathering up.
-->
<script lang="ts">
	import Root from '../internal/Root.svelte';
	import { durations } from '../motion.js';
	import type { SpinnerProps } from '../types.js';

	let props: SpinnerProps = $props();
</script>

<Root name="inchworm" defaultDuration={durations.inchworm} {...props}>
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
		<rect x="2.5" y="2.5" width="19" height="19" rx="6" />
	</svg>
	<span class="side">
		<span class="bead b0"></span>
		<span class="bead b1"></span>
		<span class="bead b2"></span>
		<span class="bead b3"></span>
		<span class="bead b4"></span>
		<span class="bead b5"></span>
		<span class="bead b6"></span>
		<span class="bead b7"></span>
		<span class="bead b8"></span>
		<span class="bead b9"></span>
		<span class="bead b10"></span>
		<span class="bead b11"></span>
	</span>
</Root>

<style>
	svg,
	.side {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	/*
	 * The worm is a chain of 12 overlapping pills, each held at a fixed share of the way from
	 * tail to head. Every pill rides the same track, 3.5 in from the outline and concentric with
	 * it: slide along the top, swing round the corner, slide down the side. Written as
	 * translate(corner) rotate(angle) translateY(-radius), so plain interpolation keeps each
	 * pill on the curve and turned along it. Percentages are of the pill itself (4 × 3). The
	 * tail is b0, the head b11.
	 */
	.bead {
		position: absolute;
		left: calc(10 / 24 * 100%);
		top: calc(10.5 / 24 * 100%);
		width: calc(4 / 24 * 100%);
		height: calc(3 / 24 * 100%);
		border-radius: 999px;
		background: currentColor;
	}

	.side,
	.bead {
		animation-iteration-count: infinite;
		animation-play-state: var(--_play-state);
		/* At rest it's stretched round the top-right corner. */
		animation-delay: calc(var(--_duration) * -0.13);
	}

	/*
	 * Each step ends gathered at the side's middle, exactly where the next one starts a quarter
	 * turn on, so the whole track turns under the worm in a single jump nobody sees.
	 */
	.side {
		animation-name: side;
		animation-duration: var(--_duration);
		animation-timing-function: steps(4, end);
	}

	.bead {
		animation-duration: calc(var(--_duration) / 4);
	}

	.b0 {
		animation-name: b0;
	}

	.b1 {
		animation-name: b1;
	}

	.b2 {
		animation-name: b2;
	}

	.b3 {
		animation-name: b3;
	}

	.b4 {
		animation-name: b4;
	}

	.b5 {
		animation-name: b5;
	}

	.b6 {
		animation-name: b6;
	}

	.b7 {
		animation-name: b7;
	}

	.b8 {
		animation-name: b8;
	}

	.b9 {
		animation-name: b9;
	}

	.b10 {
		animation-name: b10;
	}

	.b11 {
		animation-name: b11;
	}

	@keyframes side {
		to {
			transform: rotate(1turn);
		}
	}

	/*
	 * One step, computed by scripts/inchworm.mjs rather than written by hand. Planted at the
	 * top's middle, the head reaches round the corner to the side's middle (6–50%), the
	 * briefest hold, then the tail follows (54–100%), both on cubic-bezier(0.65, 0, 0.35, 1).
	 * Pill k sits k/11 of the way from tail to head, and thins to 0.7 at full stretch. Its
	 * easing is split, de Casteljau style, wherever it crosses from straight to curve, so each
	 * segment interpolates along one piece of track.
	 */
	@keyframes b0 {
		0%,
		6% {
			transform: translate(0%, -116.667%) rotate(0deg) translateY(-83.333%) scale(1);
			animation-timing-function: cubic-bezier(0.65, 0, 0.35, 1);
		}
		50%,
		54% {
			transform: translate(0%, -116.667%) rotate(0deg) translateY(-83.333%) scale(0.7);
			animation-timing-function: cubic-bezier(0.568, 0, 0.822, 0.446);
		}
		73.889% {
			transform: translate(87.5%, -116.667%) rotate(0deg) translateY(-83.333%) scale(0.796);
			animation-timing-function: cubic-bezier(0.368, 0.32, 0.632, 0.68);
		}
		80.111% {
			transform: translate(87.5%, -116.667%) rotate(90deg) translateY(-83.333%) scale(0.904);
			animation-timing-function: cubic-bezier(0.178, 0.554, 0.432, 1);
		}
		100% {
			transform: translate(87.5%, 0%) rotate(90deg) translateY(-83.333%) scale(1);
		}
	}

	@keyframes b1 {
		0%,
		6% {
			transform: translate(0%, -116.667%) rotate(0deg) translateY(-83.333%) scale(1);
			animation-timing-function: cubic-bezier(0.65, 0, 0.35, 1);
		}
		50%,
		54% {
			transform: translate(24.834%, -116.667%) rotate(0deg) translateY(-83.333%) scale(0.7);
			animation-timing-function: cubic-bezier(0.533, 0, 0.81, 0.427);
		}
		72.405% {
			transform: translate(87.5%, -116.667%) rotate(0deg) translateY(-83.333%) scale(0.776);
			animation-timing-function: cubic-bezier(0.407, 0.303, 0.658, 0.67);
		}
		79.496% {
			transform: translate(87.5%, -116.667%) rotate(90deg) translateY(-83.333%) scale(0.894);
			animation-timing-function: cubic-bezier(0.174, 0.545, 0.416, 1);
		}
		100% {
			transform: translate(87.5%, 0%) rotate(90deg) translateY(-83.333%) scale(1);
		}
	}

	@keyframes b2 {
		0%,
		6% {
			transform: translate(0%, -116.667%) rotate(0deg) translateY(-83.333%) scale(1);
			animation-timing-function: cubic-bezier(0.65, 0, 0.35, 1);
		}
		50%,
		54% {
			transform: translate(49.668%, -116.667%) rotate(0deg) translateY(-83.333%) scale(0.7);
			animation-timing-function: cubic-bezier(0.487, 0, 0.788, 0.404);
		}
		70.051% {
			transform: translate(87.5%, -116.667%) rotate(0deg) translateY(-83.333%) scale(0.751);
			animation-timing-function: cubic-bezier(0.464, 0.274, 0.697, 0.653);
		}
		78.793% {
			transform: translate(87.5%, -116.667%) rotate(90deg) translateY(-83.333%) scale(0.883);
			animation-timing-function: cubic-bezier(0.171, 0.534, 0.398, 1);
		}
		100% {
			transform: translate(87.5%, 0%) rotate(90deg) translateY(-83.333%) scale(1);
		}
	}

	@keyframes b3 {
		0%,
		6% {
			transform: translate(0%, -116.667%) rotate(0deg) translateY(-83.333%) scale(1);
			animation-timing-function: cubic-bezier(0.65, 0, 0.35, 1);
		}
		50%,
		54% {
			transform: translate(74.502%, -116.667%) rotate(0deg) translateY(-83.333%) scale(0.7);
			animation-timing-function: cubic-bezier(0.419, 0, 0.742, 0.372);
		}
		65.135% {
			transform: translate(87.5%, -116.667%) rotate(0deg) translateY(-83.333%) scale(0.72);
			animation-timing-function: cubic-bezier(0.55, 0.205, 0.755, 0.614);
		}
		77.967% {
			transform: translate(87.5%, -116.667%) rotate(90deg) translateY(-83.333%) scale(0.868);
			animation-timing-function: cubic-bezier(0.171, 0.519, 0.375, 1);
		}
		100% {
			transform: translate(87.5%, 0%) rotate(90deg) translateY(-83.333%) scale(1);
		}
	}

	@keyframes b4 {
		0%,
		6% {
			transform: translate(0%, -116.667%) rotate(0deg) translateY(-83.333%) scale(1);
			animation-timing-function: cubic-bezier(0.736, 0, 0.628, 0.699);
		}
		36.504% {
			transform: translate(87.5%, -116.667%) rotate(0deg) translateY(-83.333%) scale(0.736);
			animation-timing-function: cubic-bezier(0.231, 0.611, 0.544, 1);
		}
		50%,
		54% {
			transform: translate(87.5%, -116.667%) rotate(10.851deg) translateY(-83.333%) scale(0.7);
			animation-timing-function: cubic-bezier(0.649, 0, 0.825, 0.499);
		}
		76.946% {
			transform: translate(87.5%, -116.667%) rotate(90deg) translateY(-83.333%) scale(0.849);
			animation-timing-function: cubic-bezier(0.175, 0.499, 0.349, 1);
		}
		100% {
			transform: translate(87.5%, 0%) rotate(90deg) translateY(-83.333%) scale(1);
		}
	}

	@keyframes b5 {
		0%,
		6% {
			transform: translate(0%, -116.667%) rotate(0deg) translateY(-83.333%) scale(1);
			animation-timing-function: cubic-bezier(0.719, 0, 0.765, 0.581);
		}
		31.467% {
			transform: translate(87.5%, -116.667%) rotate(0deg) translateY(-83.333%) scale(0.789);
			animation-timing-function: cubic-bezier(0.181, 0.561, 0.445, 1);
		}
		50%,
		54% {
			transform: translate(87.5%, -116.667%) rotate(33.617deg) translateY(-83.333%) scale(0.7);
			animation-timing-function: cubic-bezier(0.612, 0, 0.829, 0.472);
		}
		75.572% {
			transform: translate(87.5%, -116.667%) rotate(90deg) translateY(-83.333%) scale(0.824);
			animation-timing-function: cubic-bezier(0.191, 0.469, 0.316, 1);
		}
		100% {
			transform: translate(87.5%, 0%) rotate(90deg) translateY(-83.333%) scale(1);
		}
	}

	@keyframes b6 {
		0%,
		6% {
			transform: translate(0%, -116.667%) rotate(0deg) translateY(-83.333%) scale(1);
			animation-timing-function: cubic-bezier(0.684, 0, 0.809, 0.531);
		}
		29.366% {
			transform: translate(87.5%, -116.667%) rotate(0deg) translateY(-83.333%) scale(0.824);
			animation-timing-function: cubic-bezier(0.171, 0.528, 0.388, 1);
		}
		50%,
		54% {
			transform: translate(87.5%, -116.667%) rotate(56.383deg) translateY(-83.333%) scale(0.7);
			animation-timing-function: cubic-bezier(0.555, 0, 0.819, 0.439);
		}
		73.376% {
			transform: translate(87.5%, -116.667%) rotate(90deg) translateY(-83.333%) scale(0.789);
			animation-timing-function: cubic-bezier(0.235, 0.419, 0.281, 1);
		}
		100% {
			transform: translate(87.5%, 0%) rotate(90deg) translateY(-83.333%) scale(1);
		}
	}

	@keyframes b7 {
		0%,
		6% {
			transform: translate(0%, -116.667%) rotate(0deg) translateY(-83.333%) scale(1);
			animation-timing-function: cubic-bezier(0.651, 0, 0.825, 0.501);
		}
		28.051% {
			transform: translate(87.5%, -116.667%) rotate(0deg) translateY(-83.333%) scale(0.849);
			animation-timing-function: cubic-bezier(0.175, 0.501, 0.351, 1);
		}
		50%,
		54% {
			transform: translate(87.5%, -116.667%) rotate(79.149deg) translateY(-83.333%) scale(0.7);
			animation-timing-function: cubic-bezier(0.456, 0, 0.769, 0.389);
		}
		68.11% {
			transform: translate(87.5%, -116.667%) rotate(90deg) translateY(-83.333%) scale(0.736);
			animation-timing-function: cubic-bezier(0.372, 0.301, 0.264, 1);
		}
		100% {
			transform: translate(87.5%, 0%) rotate(90deg) translateY(-83.333%) scale(1);
		}
	}

	@keyframes b8 {
		0%,
		6% {
			transform: translate(0%, -116.667%) rotate(0deg) translateY(-83.333%) scale(1);
			animation-timing-function: cubic-bezier(0.625, 0, 0.829, 0.481);
		}
		27.075% {
			transform: translate(87.5%, -116.667%) rotate(0deg) translateY(-83.333%) scale(0.868);
			animation-timing-function: cubic-bezier(0.245, 0.386, 0.45, 0.795);
		}
		39.349% {
			transform: translate(87.5%, -116.667%) rotate(90deg) translateY(-83.333%) scale(0.72);
			animation-timing-function: cubic-bezier(0.258, 0.628, 0.581, 1);
		}
		50%,
		54% {
			transform: translate(87.5%, -99.336%) rotate(90deg) translateY(-83.333%) scale(0.7);
			animation-timing-function: cubic-bezier(0.65, 0, 0.35, 1);
		}
		100% {
			transform: translate(87.5%, 0%) rotate(90deg) translateY(-83.333%) scale(1);
		}
	}

	@keyframes b9 {
		0%,
		6% {
			transform: translate(0%, -116.667%) rotate(0deg) translateY(-83.333%) scale(1);
			animation-timing-function: cubic-bezier(0.602, 0, 0.829, 0.466);
		}
		26.285% {
			transform: translate(87.5%, -116.667%) rotate(0deg) translateY(-83.333%) scale(0.883);
			animation-timing-function: cubic-bezier(0.303, 0.347, 0.536, 0.726);
		}
		34.647% {
			transform: translate(87.5%, -116.667%) rotate(90deg) translateY(-83.333%) scale(0.751);
			animation-timing-function: cubic-bezier(0.212, 0.596, 0.513, 1);
		}
		50%,
		54% {
			transform: translate(87.5%, -66.224%) rotate(90deg) translateY(-83.333%) scale(0.7);
			animation-timing-function: cubic-bezier(0.65, 0, 0.35, 1);
		}
		100% {
			transform: translate(87.5%, 0%) rotate(90deg) translateY(-83.333%) scale(1);
		}
	}

	@keyframes b10 {
		0%,
		6% {
			transform: translate(0%, -116.667%) rotate(0deg) translateY(-83.333%) scale(1);
			animation-timing-function: cubic-bezier(0.584, 0, 0.826, 0.455);
		}
		25.612% {
			transform: translate(87.5%, -116.667%) rotate(0deg) translateY(-83.333%) scale(0.894);
			animation-timing-function: cubic-bezier(0.342, 0.33, 0.593, 0.697);
		}
		32.395% {
			transform: translate(87.5%, -116.667%) rotate(90deg) translateY(-83.333%) scale(0.776);
			animation-timing-function: cubic-bezier(0.19, 0.573, 0.467, 1);
		}
		50%,
		54% {
			transform: translate(87.5%, -33.112%) rotate(90deg) translateY(-83.333%) scale(0.7);
			animation-timing-function: cubic-bezier(0.65, 0, 0.35, 1);
		}
		100% {
			transform: translate(87.5%, 0%) rotate(90deg) translateY(-83.333%) scale(1);
		}
	}

	@keyframes b11 {
		0%,
		6% {
			transform: translate(0%, -116.667%) rotate(0deg) translateY(-83.333%) scale(1);
			animation-timing-function: cubic-bezier(0.568, 0, 0.822, 0.446);
		}
		25.024% {
			transform: translate(87.5%, -116.667%) rotate(0deg) translateY(-83.333%) scale(0.904);
			animation-timing-function: cubic-bezier(0.368, 0.32, 0.632, 0.68);
		}
		30.976% {
			transform: translate(87.5%, -116.667%) rotate(90deg) translateY(-83.333%) scale(0.796);
			animation-timing-function: cubic-bezier(0.178, 0.554, 0.432, 1);
		}
		50%,
		54% {
			transform: translate(87.5%, 0%) rotate(90deg) translateY(-83.333%) scale(0.7);
			animation-timing-function: cubic-bezier(0.65, 0, 0.35, 1);
		}
		100% {
			transform: translate(87.5%, 0%) rotate(90deg) translateY(-83.333%) scale(1);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.side,
		.bead {
			animation-play-state: paused;
		}
	}
</style>
