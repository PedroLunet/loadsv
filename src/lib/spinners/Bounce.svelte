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
	<span class="lsv-bounce-shadow"></span>
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

	.lsv-bounce-shadow {
		position: absolute;
		top: 86.5%;
		left: 35.4%;
		width: 29.2%;
		height: 6.25%;
		border-radius: 50%;
		background: currentColor;
		animation: shadow var(--_duration) infinite;
	}

	/* After the shorthands above, which would otherwise reset these. */
	.lsv-bounce-height,
	.lsv-bounce-ball,
	.lsv-bounce-shadow {
		/* Starts on the way up, so a still frame shows a round ball in the air, not a squashed one. */
		animation-delay: calc(var(--_duration) * -0.3);
		animation-play-state: var(--_play-state);
	}

	/* Quadratic curves, like real gravity: rising decelerates, falling accelerates. */
	@keyframes rise {
		0%,
		100% {
			transform: translateY(0);
			animation-timing-function: cubic-bezier(0.5, 1, 0.89, 1);
		}
		50% {
			transform: translateY(-150%);
			animation-timing-function: cubic-bezier(0.11, 0, 0.5, 0);
		}
	}

	/* Flattens on impact, stretches with speed, and is round at the top of the bounce. */
	@keyframes squash {
		0%,
		100% {
			transform: scale(1.35, 0.7);
		}
		8%,
		92% {
			transform: scale(0.9, 1.12);
		}
		22%,
		78% {
			transform: scale(1);
		}
	}

	/* The shadow tightens and fades as the ball gets further from the floor. */
	@keyframes shadow {
		0%,
		100% {
			transform: scaleX(1);
			opacity: 0.25;
			animation-timing-function: cubic-bezier(0.5, 1, 0.89, 1);
		}
		50% {
			transform: scaleX(0.5);
			opacity: 0.1;
			animation-timing-function: cubic-bezier(0.11, 0, 0.5, 0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.lsv-bounce-height,
		.lsv-bounce-ball,
		.lsv-bounce-shadow {
			animation-play-state: paused;
		}
	}
</style>
