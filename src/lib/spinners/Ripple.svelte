<!--
	@component
	Three rings spreading out from the center.
-->
<script lang="ts">
	import Root from '../internal/Root.svelte';
	import { durations } from '../motion.js';
	import type { SpinnerProps } from '../types.js';

	let props: SpinnerProps = $props();
</script>

<Root name="ripple" defaultDuration={durations.ripple} {...props}>
	{#each { length: 3 }, i (i)}
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style:--i={i}>
			<circle cx="12" cy="12" r="10.5" />
		</svg>
	{/each}
</Root>

<style>
	svg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		animation: spread var(--_duration) linear infinite;
		/* Evenly spaced from the first frame: each ring is a third of a loop ahead of the next. */
		animation-delay: calc(var(--_duration) * (var(--i) / 3 - 1));
		animation-play-state: var(--_play-state);
	}

	@keyframes spread {
		from {
			transform: scale(0.15);
			opacity: 1;
		}
		to {
			transform: scale(1);
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		svg {
			animation-play-state: paused;
		}
	}
</style>
