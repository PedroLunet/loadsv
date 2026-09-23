<!--
	@component
	A full ring fading into its tail.
-->
<script lang="ts">
	import Root from '../internal/Root.svelte';
	import { durations } from '../motion.js';
	import type { SpinnerProps } from '../types.js';

	let props: SpinnerProps = $props();
</script>

<Root name="comet" defaultDuration={durations.comet} {...props}>
	<span class="ring"><span class="head"></span></span>
</Root>

<style>
	/*
	 * Same geometry as the stroked spinners (r = 9.5, stroke 2.5 in a 24 box):
	 * the ring sits 1.25/24 in from the edge and its stroke is 2.5/21.5 of its width.
	 */
	.ring {
		position: absolute;
		inset: 5.2%;
		border-radius: 50%;
		background: conic-gradient(transparent 4%, currentColor);
		mask: radial-gradient(closest-side, transparent calc(76.7% - 0.5px), #000 76.7%);
		animation: spin var(--_duration) linear infinite;
		animation-play-state: var(--_play-state);
	}

	/* Rounds off the bright end, like a stroke with a round cap. */
	.head {
		position: absolute;
		top: 0;
		left: 50%;
		width: 11.6%;
		height: 11.6%;
		border-radius: 50%;
		background: currentColor;
		translate: -50% 0;
	}

	@keyframes spin {
		to {
			transform: rotate(1turn);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.ring {
			animation-play-state: paused;
		}
	}
</style>
