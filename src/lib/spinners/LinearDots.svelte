<!--
	@component
	Three dots lighting up in turn from left to right.
-->
<script lang="ts">
	import Root from '../internal/Root.svelte';
	import { durations } from '../motion.js';
	import type { SpinnerProps } from '../types.js';

	let props: SpinnerProps = $props();
</script>

<Root name="linear-dots" defaultDuration={durations['linear-dots']} {...props}>
	{#each { length: 3 }, i (i)}
		<span style:--i={i}></span>
	{/each}
</Root>

<style>
	span {
		position: absolute;
		top: 40%;
		left: calc(8.75% + var(--i) * 31.25%);
		width: 20%;
		height: 20%;
		border-radius: 50%;
		background: currentColor;
		opacity: 0.25;
		animation: light var(--_duration) ease-in-out infinite;
		animation-delay: calc(var(--_duration) * (var(--i) / 3 - 1));
		animation-play-state: var(--_play-state);
	}

	@keyframes light {
		0%,
		50%,
		100% {
			opacity: 0.25;
		}
		25% {
			opacity: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		span {
			animation-play-state: paused;
		}
	}
</style>
