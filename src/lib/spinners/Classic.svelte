<!--
	@component
	Twelve fading bars arranged in a radial pattern.
-->
<script lang="ts">
	import Root from '../internal/Root.svelte';
	import { durations } from '../motion.js';
	import type { SpinnerProps } from '../types.js';

	let props: SpinnerProps = $props();
</script>

<Root name="classic" defaultDuration={durations.classic} {...props}>
	{#each { length: 12 }, i (i)}
		<span style:--i={i}></span>
	{/each}
</Root>

<style>
	/* Each bar is a full-size layer turned into place, so it pivots on the center for free. */
	span {
		position: absolute;
		inset: 0;
		transform: rotate(calc(var(--i) * 30deg));
		animation: fade var(--_duration) linear infinite;
		/* Negative delays start every bar mid-fade, so the trail is there from the first frame. */
		animation-delay: calc(var(--_duration) * (var(--i) / 12 - 1));
		animation-play-state: var(--_play-state);
	}

	span::before {
		content: '';
		position: absolute;
		top: 4%;
		left: 45.8%;
		width: 8.4%;
		height: 27%;
		border-radius: 999px;
		background: currentColor;
	}

	@keyframes fade {
		from {
			opacity: 1;
		}
		to {
			opacity: 0.15;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		span {
			animation-play-state: paused;
		}
	}
</style>
