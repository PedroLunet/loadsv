<!--
	@component
	Two hands on a faint dial, one sweeping, one creeping.
-->
<script lang="ts">
	import Root from '../internal/Root.svelte';
	import { durations } from '../motion.js';
	import type { SpinnerProps } from '../types.js';

	let props: SpinnerProps = $props();
</script>

<!-- One <svg> per hand, so each turn is a plain element transform the compositor can run. -->
<Root name="clock" defaultDuration={durations.clock} {...props}>
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
		<circle cx="12" cy="12" r="9.5" stroke-opacity="0.2" />
	</svg>
	<svg
		class="lsv-clock-hour"
		viewBox="0 0 24 24"
		stroke="currentColor"
		stroke-width="2.5"
		stroke-linecap="round"
	>
		<path d="M12 12V8.5" />
	</svg>
	<svg
		class="lsv-clock-minute"
		viewBox="0 0 24 24"
		stroke="currentColor"
		stroke-width="2.5"
		stroke-linecap="round"
	>
		<path d="M12 12V6" />
	</svg>
</Root>

<style>
	svg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.lsv-clock-minute,
	.lsv-clock-hour {
		animation: spin var(--_duration) linear infinite;
		animation-play-state: var(--_play-state);
	}

	/* A twelfth of the speed, starting at four o'clock so even a still frame reads as a clock. */
	.lsv-clock-hour {
		animation-duration: calc(var(--_duration) * 12);
		animation-delay: calc(var(--_duration) * -4);
	}

	@keyframes spin {
		to {
			transform: rotate(1turn);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.lsv-clock-minute,
		.lsv-clock-hour {
			animation-play-state: paused;
		}
	}
</style>
