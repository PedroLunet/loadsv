<!--
	@component
	A ring rippling outward from a dot.
-->
<script lang="ts">
	import Root from '../internal/Root.svelte';
	import { durations } from '../motion.js';
	import type { SpinnerProps } from '../types.js';

	let props: SpinnerProps = $props();
</script>

<Root name="pulse" defaultDuration={durations.pulse} {...props}>
	<svg viewBox="0 0 24 24" fill="currentColor">
		<circle cx="12" cy="12" r="3.5" />
	</svg>
	<svg
		class="lsv-pulse-ring"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.5"
	>
		<circle cx="12" cy="12" r="10.5" />
	</svg>
</Root>

<style>
	svg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	/* Starts at the dot's edge (3.5 / 10.5), so the ring grows out of it rather than from nothing. */
	.lsv-pulse-ring {
		transform: scale(0.33);
		animation:
			grow var(--_duration) cubic-bezier(0.23, 1, 0.32, 1) infinite,
			fade var(--_duration) linear infinite;
		animation-play-state: var(--_play-state);
	}

	@keyframes grow {
		to {
			transform: scale(1);
		}
	}

	@keyframes fade {
		to {
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.lsv-pulse-ring {
			animation-play-state: paused;
		}
	}
</style>
