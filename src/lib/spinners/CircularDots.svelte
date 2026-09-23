<!--
	@component
	Eight dots in a ring, the brightest hopping from one to the next.
-->
<script lang="ts">
	import Root from '../internal/Root.svelte';
	import { durations } from '../motion.js';
	import type { SpinnerProps } from '../types.js';

	let props: SpinnerProps = $props();
</script>

<Root name="circular-dots" defaultDuration={durations['circular-dots']} {...props}>
	{#each { length: 8 }, i (i)}
		<span style:--i={i}></span>
	{/each}
</Root>

<style>
	/* Each dot is a full-size layer turned into place, so it sits on the ring for free. */
	span {
		position: absolute;
		inset: 0;
		transform: rotate(calc(var(--i) * 45deg));
		/* step-end holds each level until the next, so the light hops instead of gliding. */
		animation: hop var(--_duration) step-end infinite;
		animation-delay: calc(var(--_duration) * (var(--i) / 8 - 1));
		animation-play-state: var(--_play-state);
	}

	/* Centered on the stroked spinners' radius, and no wider than their outer edge. */
	span::before {
		content: '';
		position: absolute;
		top: 6.25%;
		left: 41.67%;
		width: 16.67%;
		height: 16.67%;
		border-radius: 50%;
		background: currentColor;
	}

	/* A short trail: the lit dot and two fading behind it, the rest resting dim. */
	@keyframes hop {
		0% {
			opacity: 1;
		}
		12.5% {
			opacity: 0.55;
		}
		25% {
			opacity: 0.3;
		}
		37.5%,
		100% {
			opacity: 0.15;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		span {
			animation-play-state: paused;
		}
	}
</style>
