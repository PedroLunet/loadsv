<!--
	@component
	Three dots in a row, the last one leaping over the others to the front.
-->
<script lang="ts">
	import Root from '../internal/Root.svelte';
	import { durations } from '../motion.js';
	import type { SpinnerProps } from '../types.js';

	let props: SpinnerProps = $props();
</script>

<!-- Across and up are separate elements, so each can have its own curve. -->
<Root name="leap" defaultDuration={durations.leap} {...props}>
	{#each { length: 3 }, i (i)}
		<span class="lsv-leap-x" style:--i={i}><span class="lsv-leap-y"></span></span>
	{/each}
</Root>

<style>
	/*
	 * A loop is three steps, and every step each dot moves one place: two shuffle back while
	 * the last leaps to the front, so the row stays put. Dots rest low, so the leap is centered.
	 */
	.lsv-leap-x {
		position: absolute;
		top: 55%;
		left: 8.75%;
		width: 20%;
		height: 20%;
		animation: shuffle var(--_duration) cubic-bezier(0.65, 0, 0.35, 1) infinite;
		animation-delay: calc(var(--_duration) * var(--i) / -3);
		animation-play-state: var(--_play-state);
	}

	.lsv-leap-y {
		display: block;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background: currentColor;
		animation: hop var(--_duration) infinite;
		animation-delay: calc(var(--_duration) * var(--i) / -3);
		animation-play-state: var(--_play-state);
	}

	/* One place over is 156.25% of a dot. Each move takes 70% of its step, then the dot rests. */
	@keyframes shuffle {
		0% {
			transform: translateX(312.5%);
		}
		23.33%,
		33.33% {
			transform: translateX(156.25%);
		}
		56.67%,
		66.67% {
			transform: translateX(0);
		}
		90%,
		100% {
			transform: translateX(312.5%);
		}
	}

	/* Only the leap leaves the ground: rising decelerates, falling accelerates. */
	@keyframes hop {
		0%,
		66.67% {
			transform: translateY(0);
			animation-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
		}
		78.33% {
			transform: translateY(-150%);
			animation-timing-function: cubic-bezier(0.32, 0, 0.67, 0);
		}
		90%,
		100% {
			transform: translateY(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.lsv-leap-x,
		.lsv-leap-y {
			animation-play-state: paused;
		}
	}
</style>
