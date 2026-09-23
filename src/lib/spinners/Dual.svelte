<!--
	@component
	Two arcs turning in opposite directions.
-->
<script lang="ts">
	import Root from '../internal/Root.svelte';
	import { durations } from '../motion.js';
	import type { Cap, SpinnerProps } from '../types.js';

	interface Props extends SpinnerProps {
		/** How the ends of the strokes are drawn. Defaults to `round`. */
		cap?: Cap;
	}

	let { cap = 'round', ...props }: Props = $props();

	const linecap = $derived(cap === 'round' ? 'round' : 'butt');
</script>

<!-- One <svg> per arc, so each turn is a plain element transform the compositor can run. -->
<Root name="dual" defaultDuration={durations.dual} {...props}>
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
		<circle cx="12" cy="12" r="9.5" stroke-dasharray="20 60" stroke-linecap={linecap} />
	</svg>
	<svg
		class="lsv-dual-inner"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2.5"
	>
		<circle
			cx="12"
			cy="12"
			r="5"
			stroke-dasharray="10.5 32"
			stroke-dashoffset="-15.7"
			stroke-linecap={linecap}
		/>
	</svg>
</Root>

<style>
	svg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		animation: spin var(--_duration) cubic-bezier(0.65, 0, 0.35, 1) infinite;
		animation-play-state: var(--_play-state);
	}

	.lsv-dual-inner {
		animation-direction: reverse;
	}

	@keyframes spin {
		to {
			transform: rotate(1turn);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		svg {
			animation-play-state: paused;
		}
	}
</style>
