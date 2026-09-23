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

	/*
	 * Starts hidden under the dot: its outer edge (11.25 × 0.3) is just inside the dot's 3.5,
	 * so the ring grows out from beneath it. Any larger and the stroke would show around the
	 * dot the moment each loop restarts, making the dot swell for a frame.
	 */
	.lsv-pulse-ring {
		transform: scale(0.3);
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
