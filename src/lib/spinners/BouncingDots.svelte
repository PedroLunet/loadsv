<!--
	@component
	Three staggered dots bouncing up and down.
-->
<script lang="ts">
	import Root from '../internal/Root.svelte';
	import { durations } from '../motion.js';
	import type { SpinnerProps } from '../types.js';

	let props: SpinnerProps = $props();
</script>

<Root name="bouncing-dots" defaultDuration={durations['bouncing-dots']} {...props}>
	{#each { length: 3 }, i (i)}
		<span style:--i={i}></span>
	{/each}
</Root>

<style>
	/* Dots rest below center so the bounce, not the resting row, is what's centered. */
	span {
		position: absolute;
		top: 52.5%;
		left: calc(8.75% + var(--i) * 31.25%);
		width: 20%;
		height: 20%;
		border-radius: 50%;
		background: currentColor;
		animation: bounce var(--_duration) infinite;
		animation-delay: calc(var(--i) * var(--_duration) / 6);
		animation-play-state: var(--_play-state);
	}

	/* Rising decelerates, falling accelerates: gravity, not UI easing. */
	@keyframes bounce {
		0%,
		50%,
		100% {
			transform: translateY(0);
			animation-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
		}
		25% {
			transform: translateY(-125%);
			animation-timing-function: cubic-bezier(0.32, 0, 0.67, 0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		span {
			animation-play-state: paused;
		}
	}
</style>
