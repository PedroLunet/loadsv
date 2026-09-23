<!--
	@component
	Five hanging balls, the outer two swinging in turn.
-->
<script lang="ts">
	import Root from '../internal/Root.svelte';
	import { durations } from '../motion.js';
	import type { SpinnerProps } from '../types.js';

	let props: SpinnerProps = $props();
</script>

<Root name="newtons-cradle" defaultDuration={durations['newtons-cradle']} {...props}>
	<span class="lsv-newtons-cradle-bar"></span>
	{#each { length: 5 }, i (i)}
		<span
			class="lsv-newtons-cradle-pendulum"
			class:lsv-newtons-cradle-left={i === 0}
			class:lsv-newtons-cradle-right={i === 4}
			style:--i={i}
		></span>
	{/each}
</Root>

<style>
	.lsv-newtons-cradle-bar {
		position: absolute;
		top: 26%;
		left: 8.3%;
		width: 83.3%;
		height: 4.2%;
		border-radius: 999px;
		background: currentColor;
		opacity: 0.3;
	}

	/*
	 * A pendulum spans pivot to ball and turns on its top edge, so string and ball swing as one.
	 * Strings are short enough that a raised outer ball still stays inside the box.
	 */
	.lsv-newtons-cradle-pendulum {
		position: absolute;
		top: 28.1%;
		left: calc(12.5% + var(--i) * 15%);
		width: 15%;
		height: 45%;
		transform-origin: 50% 0;
	}

	/* The string starts under the bar, so the two faint layers never stack into dark spots. */
	.lsv-newtons-cradle-pendulum::before {
		content: '';
		position: absolute;
		top: 4.6%;
		left: 41.7%;
		width: 16.7%;
		height: 78.7%;
		background: currentColor;
		opacity: 0.3;
	}

	.lsv-newtons-cradle-pendulum::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 33.3%;
		border-radius: 50%;
		background: currentColor;
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
			transform: rotate(20deg);
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
			transform: rotate(-20deg);
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
