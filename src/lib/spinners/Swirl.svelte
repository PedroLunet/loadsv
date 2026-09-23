<!--
	@component
	A bright cell gliding round the edge of a grid, trailing light.
-->
<script lang="ts">
	import Root from '../internal/Root.svelte';
	import { durations } from '../motion.js';
	import type { SpinnerProps } from '../types.js';

	let props: SpinnerProps = $props();

	/** The eight edge cells of a 3×3 grid, clockwise from the top left. */
	const cells = [
		[0, 0],
		[0, 1],
		[0, 2],
		[1, 2],
		[2, 2],
		[2, 1],
		[2, 0],
		[1, 0]
	];
</script>

<Root name="swirl" defaultDuration={durations.swirl} {...props}>
	{#each cells as [row, col], k (k)}
		<span style:--row={row} style:--col={col} style:--k={k}></span>
	{/each}
</Root>

<style>
	/* The same cells as Blocks, so the two grids line up. */
	span {
		position: absolute;
		top: calc(8.3% + var(--row) * 31.25%);
		left: calc(8.3% + var(--col) * 31.25%);
		width: 20.8%;
		height: 20.8%;
		border-radius: 20%;
		background: currentColor;
		animation: fade var(--_duration) infinite;
		/* Negative delays start every cell mid-fade, so the trail is there from the first frame. */
		animation-delay: calc(var(--_duration) * (var(--k) / 8 - 1));
		animation-play-state: var(--_play-state);
	}

	/*
	 * The light drops off fast and settles over five cells: a clear head with a trail behind,
	 * rather than an even gradient round the whole grid.
	 */
	@keyframes fade {
		0% {
			opacity: 1;
			animation-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
		}
		62.5%,
		100% {
			opacity: 0.15;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		span {
			animation-play-state: paused;
		}
	}
</style>
