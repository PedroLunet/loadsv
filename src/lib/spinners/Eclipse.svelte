<!--
	@component
	Two dots circling each other, seen edge-on, one passing behind the other.
-->
<script lang="ts">
	import Root from '../internal/Root.svelte';
	import { durations } from '../motion.js';
	import type { SpinnerProps } from '../types.js';

	let props: SpinnerProps = $props();
</script>

<Root name="eclipse" defaultDuration={durations.eclipse} {...props}>
	<span class="lsv-eclipse-orbit">
		<span class="lsv-eclipse-dot"></span>
		<span class="lsv-eclipse-dot"></span>
	</span>
</Root>

<style>
	/*
	 * A real orbit: the pair turns in 3D and the browser works out which dot is in front,
	 * so the eclipse needs no z-index tricks. Seen edge-on, a steady turn already eases
	 * each dot in and out of the crossing.
	 */
	.lsv-eclipse-orbit {
		position: absolute;
		inset: 0;
		transform-style: preserve-3d;
		animation: orbit var(--_duration) linear infinite;
		/* Starts just before the crossing, so a still frame shows one dot overlapping the other. */
		animation-delay: calc(var(--_duration) * -0.2);
		animation-play-state: var(--_play-state);
	}

	.lsv-eclipse-dot {
		position: absolute;
		top: 35.4%;
		left: 35.4%;
		width: 29.2%;
		height: 29.2%;
		border-radius: 50%;
		background: currentColor;
		/* Turning back as the orbit turns keeps each dot facing the viewer. */
		animation:
			face var(--_duration) linear infinite,
			shade var(--_duration) ease-in-out infinite;
		animation-delay: calc(var(--_duration) * -0.2);
		animation-play-state: var(--_play-state);
	}

	.lsv-eclipse-dot:first-child {
		--x: 78.6%;
	}

	/* The second dot is half an orbit behind, so it reaches the back half a loop later. */
	.lsv-eclipse-dot:last-child {
		--x: -78.6%;
		animation-delay: calc(var(--_duration) * -0.2), calc(var(--_duration) * -0.7);
	}

	@keyframes orbit {
		from {
			transform: perspective(calc(var(--lsv-size) * 1.5)) rotateY(0);
		}
		to {
			transform: perspective(calc(var(--lsv-size) * 1.5)) rotateY(1turn);
		}
	}

	@keyframes face {
		from {
			transform: translateX(var(--x)) rotateY(0);
		}
		to {
			transform: translateX(var(--x)) rotateY(-1turn);
		}
	}

	/* The far dot sinks into shadow, so the depth still reads at small sizes. */
	@keyframes shade {
		0%,
		50%,
		100% {
			opacity: 1;
		}
		25% {
			opacity: 0.4;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.lsv-eclipse-orbit,
		.lsv-eclipse-dot {
			animation-play-state: paused;
		}
	}
</style>
