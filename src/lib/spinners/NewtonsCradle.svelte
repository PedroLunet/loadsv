<!--
	@component
	Three balls in a row, the outer two swinging out in turn.
-->
<script lang="ts">
	import Root from '../internal/Root.svelte';
	import { durations } from '../motion.js';
	import type { SpinnerProps } from '../types.js';

	let props: SpinnerProps = $props();
</script>

<Root name="newtons-cradle" defaultDuration={durations['newtons-cradle']} {...props}>
	{#each { length: 3 }, i (i)}
		<span
			class="lsv-newtons-cradle-ball"
			class:lsv-newtons-cradle-left={i === 0}
			class:lsv-newtons-cradle-right={i === 2}
			style:--i={i}
		></span>
	{/each}
</Root>

<style>
	/*
	 * Balls sit a pixel apart even at 16px, so the row never blurs into a bar. The row rests
	 * just below center, so a raised ball and the resting row are centered together.
	 */
	.lsv-newtons-cradle-ball {
		position: absolute;
		top: 44.35%;
		left: calc(18.75% + var(--i) * 22.92%);
		width: 16.67%;
		height: 16.67%;
		border-radius: 50%;
		background: currentColor;
		/* An unseen string: each ball turns on a pivot above it, so it swings on an arc. */
		transform-origin: 50% -118.75%;
	}

	.lsv-newtons-cradle-left,
	.lsv-newtons-cradle-right {
		animation: swing-left var(--_duration) infinite;
		/* Starts with the left ball raised: the pose everyone knows, even as a still frame. */
		animation-delay: calc(var(--_duration) / -4);
		animation-play-state: var(--_play-state);
	}

	.lsv-newtons-cradle-right {
		animation-name: swing-right;
	}

	/* A pendulum moves like a sine wave: fastest at the bottom, stopping at each end. */
	@keyframes swing-left {
		0% {
			transform: rotate(0);
			animation-timing-function: cubic-bezier(0.61, 1, 0.88, 1);
		}
		25% {
			transform: rotate(36deg);
			animation-timing-function: cubic-bezier(0.12, 0, 0.39, 0);
		}
		50%,
		100% {
			transform: rotate(0);
		}
	}

	@keyframes swing-right {
		0%,
		50% {
			transform: rotate(0);
			animation-timing-function: cubic-bezier(0.61, 1, 0.88, 1);
		}
		75% {
			transform: rotate(-36deg);
			animation-timing-function: cubic-bezier(0.12, 0, 0.39, 0);
		}
		100% {
			transform: rotate(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.lsv-newtons-cradle-left,
		.lsv-newtons-cradle-right {
			animation-play-state: paused;
		}
	}
</style>
