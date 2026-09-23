<!--
	@component
	A ball bouncing on the spot, squashing as it lands.
-->
<script lang="ts">
	import Root from '../internal/Root.svelte';
	import { durations } from '../motion.js';
	import type { SpinnerProps } from '../types.js';

	let props: SpinnerProps = $props();
</script>

<!-- Height and squash are separate elements, so the squash can pivot on the ball's base. -->
<Root name="bounce" defaultDuration={durations.bounce} {...props}>
	<span class="lsv-bounce-height"><span class="lsv-bounce-ball"></span></span>
</Root>

<style>
	.lsv-bounce-height {
		position: absolute;
		top: 56.25%;
		left: 35.4%;
		width: 29.2%;
		height: 29.2%;
		animation: rise var(--_duration) infinite;
	}

	.lsv-bounce-ball {
		display: block;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background: currentColor;
		transform-origin: 50% 100%;
		animation: squash var(--_duration) linear infinite;
	}

	/* After the shorthands above, which would otherwise reset these. */
	.lsv-bounce-height,
	.lsv-bounce-ball {
		/* Starts on the way up, so a still frame shows a round ball in the air, not a squashed one. */
		animation-delay: calc(var(--_duration) * -0.3);
		animation-play-state: var(--_play-state);
	}

	/*
	 * Quadratic curves, like real gravity: rising decelerates, falling accelerates. The ball
	 * stays down for the tenth of a loop around 0%, so it squashes against the floor, not
	 * in the air above it.
	 */
	@keyframes rise {
		0%,
		5%,
		95%,
		100% {
			transform: translateY(0);
			animation-timing-function: cubic-bezier(0.5, 1, 0.89, 1);
		}
		50% {
			transform: translateY(-150%);
			animation-timing-function: cubic-bezier(0.11, 0, 0.5, 0);
		}
	}

	/*
	 * Arrives stretched with speed, flattens while it's down, and leaves stretched again,
	 * round by the time it slows near the top.
	 */
	@keyframes squash {
		0%,
		100% {
			transform: scale(1.35, 0.7);
		}
		5%,
		95% {
			transform: scale(0.9, 1.12);
		}
		20%,
		80% {
			transform: scale(1);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.lsv-bounce-height,
		.lsv-bounce-ball {
			animation-play-state: paused;
		}
	}
</style>
