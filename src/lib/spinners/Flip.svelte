<!--
	@component
	A square flipping over on one axis, then the other.
-->
<script lang="ts">
	import Root from '../internal/Root.svelte';
	import { durations } from '../motion.js';
	import type { SpinnerProps } from '../types.js';

	let props: SpinnerProps = $props();
</script>

<Root name="flip" defaultDuration={durations.flip} {...props}>
	<span></span>
</Root>

<style>
	span {
		position: absolute;
		inset: 25%;
		border-radius: 16%;
		background: currentColor;
		animation: flip var(--_duration) infinite;
		animation-play-state: var(--_play-state);
	}

	/*
	 * Perspective scales with the spinner so the depth reads the same at any size.
	 * Each half dwells face-on, then turns quickly: the strong in-out is what makes it a flip.
	 */
	@keyframes flip {
		0% {
			transform: perspective(calc(var(--lsv-size) * 3)) rotateX(0) rotateY(0);
			animation-timing-function: cubic-bezier(0.77, 0, 0.175, 1);
		}
		50% {
			transform: perspective(calc(var(--lsv-size) * 3)) rotateX(-180deg) rotateY(0);
			animation-timing-function: cubic-bezier(0.77, 0, 0.175, 1);
		}
		100% {
			transform: perspective(calc(var(--lsv-size) * 3)) rotateX(-180deg) rotateY(-180deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		span {
			animation-play-state: paused;
		}
	}
</style>
