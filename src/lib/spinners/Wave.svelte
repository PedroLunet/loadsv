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
	span {
		position: absolute;
		top: 16.7%;
		left: calc(11.5% + var(--i) * 16.7%);
		width: 10.4%;
		height: 66.7%;
		border-radius: 999px;
		background: currentColor;
		transform: scaleY(0.4);
		animation: rise var(--_duration) ease-in-out infinite;
		animation-delay: calc(var(--_duration) * (var(--i) / 10 - 1));
		animation-play-state: var(--_play-state);
	}

	@keyframes rise {
		0%,
		100% {
			transform: scaleY(0.4);
		}
		50% {
			transform: scaleY(1);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		span {
			animation-play-state: paused;
		}
	}
</style>
