<!--
	@component
	Five bars rising and falling in a wave.
-->
<script lang="ts">
	import Root from '../internal/Root.svelte';
	import { durations } from '../motion.js';
	import type { SpinnerProps } from '../types.js';

	let props: SpinnerProps = $props();
</script>

<Root name="wave" defaultDuration={durations.wave} {...props}>
	{#each { length: 5 }, i (i)}
		<span style:--i={i}></span>
	{/each}
</Root>

<style>
	/*
	 * A bar runs from 6.4 of 24 at rest to 16 at full height. Scaling one rounded bar is
	 * what keeps it on the compositor, but it scales the round ends too, so each bar is
	 * drawn at the height between the two (√(6.4 × 16) ≈ 10.1). Its ends then squash a
	 * little at rest and stretch a little at full height, and read as round at both,
	 * instead of flattening to square whenever the bar is short.
	 */
	span {
		position: absolute;
		top: 28.9%;
		left: calc(11.5% + var(--i) * 16.7%);
		width: 10.4%;
		height: 42.2%;
		border-radius: 999px;
		background: currentColor;
		transform: scaleY(0.632);
		animation: rise var(--_duration) ease-in-out infinite;
		animation-delay: calc(var(--_duration) * (var(--i) / 10 - 1));
		animation-play-state: var(--_play-state);
	}

	@keyframes rise {
		0%,
		100% {
			transform: scaleY(0.632);
		}
		50% {
			transform: scaleY(1.581);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		span {
			animation-play-state: paused;
		}
	}
</style>
