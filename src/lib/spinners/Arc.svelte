<!--
	@component
	A single open stroke rotating in a circle.
-->
<script lang="ts">
	import Root from '../internal/Root.svelte';
	import { durations } from '../motion.js';
	import type { Cap, Easing, SpinnerProps } from '../types.js';

	interface Props extends SpinnerProps {
		/** How it moves through each turn. Defaults to `linear`. */
		easing?: Easing;
		/** How the ends of the stroke are drawn. Defaults to `round`. */
		cap?: Cap;
	}

	let { easing = 'linear', cap = 'round', ...props }: Props = $props();
</script>

<Root name="arc" defaultDuration={durations.arc} {...props}>
	<svg viewBox="0 0 24 24" fill="none" data-easing={easing}>
		<circle
			cx="12"
			cy="12"
			r="9.5"
			stroke="currentColor"
			stroke-width="2.5"
			stroke-dasharray="15 60"
			stroke-linecap={cap === 'round' ? 'round' : 'butt'}
		/>
	</svg>
</Root>

<style>
	svg {
		display: block;
		width: 100%;
		height: 100%;
		animation: spin var(--_duration) linear infinite;
		animation-play-state: var(--_play-state);
	}

	svg[data-easing='ease-in-out'] {
		animation-timing-function: cubic-bezier(0.65, 0, 0.35, 1);
	}

	/* A linear turn and an eased turn added together: the speed swells without ever stopping. */
	svg[data-easing='stacked'] {
		animation-name: spin, spin;
		animation-timing-function: linear, cubic-bezier(0.65, 0, 0.35, 1);
		animation-composition: replace, add;
	}

	@keyframes spin {
		to {
			transform: rotate(1turn);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		svg {
			animation: none;
		}
	}
</style>
