<!--
	@component
	An hourglass draining its sand, then flipping over.
-->
<script lang="ts">
	import Root from '../internal/Root.svelte';
	import { durations } from '../motion.js';
	import type { SpinnerProps } from '../types.js';

	let props: SpinnerProps = $props();

	/**
	 * The top half's sand, in the glass's 24-unit coordinates: how wide the glass lets each
	 * bar be, from the surface down to the neck. The bars sit 1.8 units apart, centred at
	 * 4.3, 6.1, 7.9 and 9.7. The bottom half's is the same, turned over.
	 */
	const widths = [10.24, 11.94, 8.93, 3.11];
	/** How wide a bar squeezes to as it slides into the neck. */
	const NECK = 1.4;

	const bars = widths.map((w, k) => ({
		w,
		/** Its width one place further down, for the slide. */
		next: (widths[k + 1] ?? NECK) / w,
		/** Its width as a fresh heap, before it spreads: every portion is the neck's bar. */
		heap: widths[3] / w,
		/** Only the bar at the neck fades as it slides: the others land on the next bar. */
		fade: k === 3 ? 0 : 1
	}));
</script>

<!--
	The sand is a stack of thin bars, each as wide as the glass allows. When the bar at the
	neck drops through, everything above slides down a place, narrowing to fit. The portion
	falls and lands as a small heap; when the next one lands on it, it spreads out to fill
	the glass. After four portions the top is empty and the bottom full.

	Sliding is a trick: every bar moves down a place at once, then all jump back while the
	emptied top place goes dark. Each bar lands exactly where the next one was, so the jump
	can't be seen. That way each bar does the same thing every step.

	A loop is two pours and a whole turn, so it ends exactly where it started. After the
	turn each half does the other's job.
-->
<Root name="hourglass" defaultDuration={durations.hourglass} {...props}>
	<span class="lsv-hourglass-glass">
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
			<path
				d="M8 2.5H16Q19.25 2.5 19.25 5.75C19.25 9.6 13.5 10.4 13.5 12C13.5 13.6 19.25 14.4 19.25 18.25Q19.25 21.5 16 21.5H8Q4.75 21.5 4.75 18.25C4.75 14.4 10.5 13.6 10.5 12C10.5 10.4 4.75 9.6 4.75 5.75Q4.75 2.5 8 2.5Z"
			/>
		</svg>
		{#each bars as bar, k (k)}
			{#each [false, true] as bottom (bottom)}
				<span
					class="lsv-hourglass-bar"
					class:lsv-hourglass-top={!bottom}
					class:lsv-hourglass-bottom={bottom}
					style:--k={k}
					style:--w={bar.w}
					style:--next={bar.next}
					style:--heap={bar.heap}
					style:--fade={bar.fade}
				>
					<span></span>
				</span>
				<span
					class="lsv-hourglass-drop"
					class:lsv-hourglass-top={!bottom}
					class:lsv-hourglass-bottom={bottom}
					style:--k={k}
					style:--w={widths[3]}
				>
					<span></span>
				</span>
			{/each}
		{/each}
	</span>
</Root>

<style>
	.lsv-hourglass-glass,
	.lsv-hourglass-glass > svg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	/*
	 * One of the glass's 24 units; how thick a bar is; how far the surface bar sits from the
	 * end of the glass; the distance between bars; and how far the surface bar's portion
	 * falls. Browsers round each bar to whole pixels, so if these aren't whole, some bars
	 * and gaps come out a pixel bigger than others. Rounding them first keeps them even at
	 * every size. Rounding can only grow the stack toward the neck, where the bars are
	 * narrow, and never so far that it spills into it.
	 */
	.lsv-hourglass-glass {
		--_unit: calc(var(--lsv-size) / 24);
		--_thick: var(--_unit);
		--_surface: calc(var(--_unit) * 3.8);
		--_pitch: calc(var(--_unit) * 1.8);
		--_reach: calc(var(--_unit) * 10.9 - var(--_thick) / 2 - var(--_surface));
	}

	@supports (width: round(1.5px, 1px)) {
		.lsv-hourglass-glass {
			--_thick: max(1px, round(var(--_unit), 1px));
			--_surface: round(var(--_unit) * 3.8, 1px);
			--_pitch: min(round(var(--_unit) * 1.8, 1px), var(--_unit) * 2.1);
			--_reach: round(var(--_unit) * 10.9 - var(--_thick) / 2 - var(--_surface), 1px);
		}
	}

	/* How far a bar's outer edge is from its end of the glass. */
	.lsv-hourglass-bar,
	.lsv-hourglass-drop {
		--_edge: calc(var(--_surface) + var(--k) * var(--_pitch));
		position: absolute;
		left: calc((12 - var(--w) / 2) / 24 * 100%);
		width: calc(var(--w) / 24 * 100%);
	}

	.lsv-hourglass-bar > span,
	.lsv-hourglass-drop > span {
		position: absolute;
		left: 0;
		width: 100%;
		height: var(--_thick);
		border-radius: 999px;
		background: currentColor;
	}

	/* A bar in its place. It slides down one pitch, onto the next. */
	.lsv-hourglass-bar {
		height: var(--_thick);
	}

	.lsv-hourglass-bar.lsv-hourglass-top,
	.lsv-hourglass-drop.lsv-hourglass-top {
		top: var(--_edge);
	}

	.lsv-hourglass-bar.lsv-hourglass-bottom,
	.lsv-hourglass-drop.lsv-hourglass-bottom {
		bottom: var(--_edge);
	}

	.lsv-hourglass-bar > span,
	.lsv-hourglass-drop.lsv-hourglass-top > span {
		top: 0;
	}

	/*
	 * A falling portion sits at the end of a box that spans its fall, from where it lands to
	 * just past the neck, so moving the box by its own height carries it the whole way. It
	 * lands on exactly the pixels its bar takes over. The box scales about the portion.
	 */
	.lsv-hourglass-drop {
		height: calc(var(--_reach) - var(--k) * var(--_pitch));
	}

	.lsv-hourglass-drop.lsv-hourglass-top {
		transform-origin: 50% calc(var(--_thick) / 2);
	}

	.lsv-hourglass-drop.lsv-hourglass-bottom {
		transform-origin: 50% calc(100% - var(--_thick) / 2);
	}

	.lsv-hourglass-drop.lsv-hourglass-bottom > span {
		bottom: 0;
	}

	/* Names only below, so nothing more specific resets the delays or the play state. */
	.lsv-hourglass-glass,
	.lsv-hourglass-bar,
	.lsv-hourglass-bar > span,
	.lsv-hourglass-drop {
		animation-duration: var(--_duration);
		animation-iteration-count: infinite;
		animation-play-state: var(--_play-state);
	}

	.lsv-hourglass-glass {
		animation-name: turn;
	}

	.lsv-hourglass-bar.lsv-hourglass-top {
		animation-name: top-bar;
	}

	.lsv-hourglass-bar.lsv-hourglass-top > span {
		animation-name: top-slide;
	}

	.lsv-hourglass-bar.lsv-hourglass-bottom {
		animation-name: bottom-bar;
	}

	.lsv-hourglass-bar.lsv-hourglass-bottom > span {
		animation-name: bottom-slide;
	}

	.lsv-hourglass-drop.lsv-hourglass-top {
		animation-name: top-drop;
	}

	.lsv-hourglass-drop.lsv-hourglass-bottom {
		animation-name: bottom-drop;
	}

	/*
	 * The loop starts just after a turn, with all the sand on top: a still frame. A bar's
	 * place empties, and its portion lands, a step after the one before it. Sliding is the
	 * same for every bar at once, so it has no delay.
	 */
	.lsv-hourglass-bar,
	.lsv-hourglass-drop {
		animation-delay: calc(var(--_duration) * (var(--k) * 0.07 - 1));
	}

	/* Each pour takes most of a half; the hourglass turns over in what's left. */
	@keyframes turn {
		0%,
		36% {
			transform: rotate(0);
			animation-timing-function: cubic-bezier(0.65, 0, 0.35, 1);
		}
		50%,
		86% {
			transform: rotate(0.5turn);
			animation-timing-function: cubic-bezier(0.65, 0, 0.35, 1);
		}
		100% {
			transform: rotate(1turn);
		}
	}

	/*
	 * A pour is four steps, 7% apart. Each step, every bar slides down a place and jumps
	 * back, and the bar at the neck fades into it. The sand never stops: each step runs
	 * straight into the next at the same speed. Only the first eases in, so it gets a
	 * little longer to reach that speed without overshooting it. Upside down, the same
	 * happens the other way round, so the bottom half slides up.
	 */
	@keyframes top-slide {
		0% {
			transform: none;
			opacity: 1;
			animation-timing-function: cubic-bezier(0.17, 0, 0.5, 0.39);
		}
		8.5%,
		15.5%,
		22.5%,
		29.5% {
			transform: translateY(var(--_pitch)) scaleX(var(--next));
			opacity: var(--fade);
			animation-timing-function: step-start;
		}
		8.51%,
		15.51%,
		22.51% {
			transform: none;
			opacity: 1;
			animation-timing-function: linear;
		}
		29.51%,
		100% {
			transform: none;
			opacity: 1;
		}
	}

	@keyframes bottom-slide {
		0%,
		50% {
			transform: none;
			opacity: 1;
			animation-timing-function: cubic-bezier(0.17, 0, 0.5, 0.39);
		}
		58.5%,
		65.5%,
		72.5%,
		79.5% {
			transform: translateY(calc(var(--_pitch) * -1)) scaleX(var(--next));
			opacity: var(--fade);
			animation-timing-function: step-start;
		}
		58.51%,
		65.51%,
		72.51% {
			transform: none;
			opacity: 1;
			animation-timing-function: linear;
		}
		79.51%,
		100% {
			transform: none;
			opacity: 1;
		}
	}

	/*
	 * Timed for the bar nearest the surface; the others follow a step behind. A place goes
	 * dark as its bar slides out of it for good. Filling, it lights up as a heap the moment
	 * the next portion lands on it, and spreads out to the glass like something poured.
	 */
	@keyframes top-bar {
		0% {
			transform: none;
			opacity: 1;
			animation-timing-function: step-end;
		}
		8.5% {
			transform: scaleX(var(--heap));
			opacity: 0;
			animation-timing-function: step-end;
		}
		68% {
			transform: scaleX(var(--heap));
			opacity: 1;
			animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
		}
		74%,
		100% {
			transform: none;
			opacity: 1;
		}
	}

	@keyframes bottom-bar {
		0% {
			transform: scaleX(var(--heap));
			opacity: 0;
			animation-timing-function: step-end;
		}
		18% {
			transform: scaleX(var(--heap));
			opacity: 1;
			animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
		}
		24% {
			transform: none;
			opacity: 1;
			animation-timing-function: step-end;
		}
		58.5%,
		100% {
			transform: scaleX(var(--heap));
			opacity: 0;
		}
	}

	/*
	 * A portion drops as its bar reaches the neck, as a sliver small enough to clear it, and
	 * grows as it falls. It lands just as the next one drops, so there's always one falling.
	 * It stays a heap until the next one lands, then hands over to its bar. Shrinking both
	 * ways at once keeps its ends round.
	 */
	@keyframes top-drop {
		0%,
		54% {
			transform: translateY(100%) scale(0.5);
			opacity: 0;
			animation-timing-function: cubic-bezier(0.55, 0, 0.5, 1);
		}
		55.5% {
			opacity: 1;
		}
		61% {
			transform: none;
			opacity: 1;
			animation-timing-function: step-end;
		}
		68%,
		100% {
			transform: translateY(100%) scale(0.5);
			opacity: 0;
		}
	}

	@keyframes bottom-drop {
		0%,
		4% {
			transform: translateY(-100%) scale(0.5);
			opacity: 0;
			animation-timing-function: cubic-bezier(0.55, 0, 0.5, 1);
		}
		5.5% {
			opacity: 1;
		}
		11% {
			transform: none;
			opacity: 1;
			animation-timing-function: step-end;
		}
		18%,
		100% {
			transform: translateY(-100%) scale(0.5);
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.lsv-hourglass-glass,
		.lsv-hourglass-bar,
		.lsv-hourglass-bar > span,
		.lsv-hourglass-drop {
			animation-play-state: paused;
		}
	}
</style>
