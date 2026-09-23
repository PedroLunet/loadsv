<!--
	@component
	Three electrons circling a nucleus, each on its own tilted orbit.
-->
<script lang="ts">
	import Root from '../internal/Root.svelte';
	import { durations } from '../motion.js';
	import type { SpinnerProps } from '../types.js';

	let props: SpinnerProps = $props();
</script>

<Root name="atom" defaultDuration={durations.atom} {...props}>
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
		<g stroke-width="1.25" stroke-opacity="0.3">
			{#each { length: 3 }, k (k)}
				<ellipse cx="12" cy="12" rx="10" ry="3.75" transform="rotate({k * 60} 12 12)" />
			{/each}
		</g>
		<circle cx="12" cy="12" r="2.25" fill="currentColor" stroke="none" />
	</svg>
	{#each { length: 3 }, k (k)}
		<!-- Each orbit is tilted as a whole; inside it, two sweeps trace the ellipse. -->
		<span class="lsv-atom-orbit" style:--k={k}>
			<span class="lsv-atom-x"><span class="lsv-atom-y"></span></span>
		</span>
	{/each}
</Root>

<style>
	svg,
	.lsv-atom-orbit {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.lsv-atom-orbit {
		transform: rotate(calc(var(--k) * 60deg));
	}

	/*
	 * Across and down, a quarter loop apart, both with sine easing: together that's exactly
	 * the ellipse drawn behind. Each electron is a third of a loop ahead of the last.
	 */
	.lsv-atom-x {
		position: absolute;
		top: 42.7%;
		left: 42.7%;
		width: 14.6%;
		height: 14.6%;
		animation: sway calc(var(--_duration) / 2) cubic-bezier(0.37, 0, 0.63, 1) infinite alternate;
		animation-delay: calc(var(--_duration) * var(--k) / -3);
		animation-play-state: var(--_play-state);
	}

	.lsv-atom-y {
		display: block;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background: currentColor;
		animation: bob calc(var(--_duration) / 2) cubic-bezier(0.37, 0, 0.63, 1) infinite alternate;
		animation-delay: calc(var(--_duration) * (var(--k) / -3 - 0.25));
		animation-play-state: var(--_play-state);
	}

	@keyframes sway {
		from {
			transform: translateX(calc(var(--lsv-size) * 10 / 24));
		}
		to {
			transform: translateX(calc(var(--lsv-size) * -10 / 24));
		}
	}

	@keyframes bob {
		from {
			transform: translateY(calc(var(--lsv-size) * -3.75 / 24));
		}
		to {
			transform: translateY(calc(var(--lsv-size) * 3.75 / 24));
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.lsv-atom-x,
		.lsv-atom-y {
			animation-play-state: paused;
		}
	}
</style>
