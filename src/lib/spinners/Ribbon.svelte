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
		--_unit: calc(var(--lsv-size) / 24);
		--_thick: calc(var(--_unit) * 3.6);
		--_pitch: calc(var(--_unit) * 6);
		--_top: calc(var(--_unit) * 12 - var(--_thick) / 2 - var(--_pitch));
		position: absolute;
		left: calc(5 / 24 * 100%);
		top: calc(var(--_top) + var(--i) * var(--_pitch));
		width: calc(14 / 24 * 100%);
		height: var(--_thick);
		border-radius: 999px;
		background: currentColor;
		animation: sway var(--_duration) cubic-bezier(0.37, 0, 0.63, 1) infinite;
		animation-delay: calc(var(--_duration) * (var(--i) / 4 - 1));
		animation-play-state: var(--_play-state);
	}

	/*
	 * Browsers round each pill to whole pixels, so unless the thickness and the distance
	 * between pills are whole, one pill comes out a pixel thicker or a gap a pixel wider
	 * than the rest. Rounding them first keeps the stack even at every size.
	 */
	@supports (width: round(1.5px, 1px)) {
		span {
			--_thick: max(1px, round(var(--_unit) * 3.6, 1px));
			--_pitch: round(var(--_unit) * 6, 1px);
			--_top: round(var(--_unit) * 12 - var(--_thick) / 2 - var(--_pitch), 1px);
		}
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
