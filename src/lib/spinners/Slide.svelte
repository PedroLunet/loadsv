<!--
	@component
	Three dots taking turns sliding into the empty corner of a square.
-->
<script lang="ts">
	import Root from '../internal/Root.svelte';
	import { durations } from '../motion.js';
	import type { SpinnerProps } from '../types.js';

	let props: SpinnerProps = $props();
</script>

<Root name="slide" defaultDuration={durations.slide} {...props}>
	{#each { length: 3 }, i (i)}
		<span style:--i={i}></span>
	{/each}
</Root>

<style>
	/*
	 * A loop is twelve moves. The dot beside the gap always slides in, which works out to
	 * every dot stepping one corner clockwise every third move, so one track serves all three.
	 */
	span {
		position: absolute;
		top: 14.6%;
		left: 14.6%;
		width: 29.2%;
		height: 29.2%;
		border-radius: 50%;
		background: currentColor;
		animation: slide var(--_duration) cubic-bezier(0.65, 0, 0.35, 1) infinite;
		/* Dots start in the top right, bottom right and bottom left corners, the gap top left. */
		animation-delay: calc(var(--_duration) * (-1 - 4 * var(--i)) / 12);
		animation-play-state: var(--_play-state);
	}

	/* Each move takes three quarters of its twelfth, then the dot rests. 143% is one corner over. */
	@keyframes slide {
		0% {
			transform: translate(0, 0);
		}
		6.25%,
		25% {
			transform: translate(143%, 0);
		}
		31.25%,
		50% {
			transform: translate(143%, 143%);
		}
		56.25%,
		75% {
			transform: translate(0, 143%);
		}
		81.25%,
		100% {
			transform: translate(0, 0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		span {
			animation-play-state: paused;
		}
	}
</style>
