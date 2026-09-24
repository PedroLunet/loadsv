<!--
	@component
	Eight petals, long and short, flaring in a wave while the spark slowly turns.
-->
<script lang="ts">
	import Root from '../internal/Root.svelte';
	import { durations } from '../motion.js';
	import type { SpinnerProps } from '../types.js';

	let props: SpinnerProps = $props();

	/*
	 * Each petal starts 3 out from the centre. Long ones flare between 4 and 8 long, short
	 * ones between 2.5 and 5. Scaling a rounded petal scales its ends too, so each is drawn
	 * at the length between the two and scaled either way, which keeps the ends looking
	 * round at both.
	 */
	const petals = Array.from({ length: 8 }, (_, i) => (i % 2 ? 3.54 : 5.66));
</script>

<Root name="spark" defaultDuration={durations.spark} {...props}>
	<span class="turn">
		{#each petals as length, i (i)}
			<span class="arm" style:--i={i}>
				<span class="petal" style:--length={length}></span>
			</span>
		{/each}
	</span>
</Root>

<style>
	.turn,
	.arm {
		position: absolute;
		inset: 0;
	}

	/* Each arm is a full-size layer turned into place, so its petal pivots on the centre. */
	.arm {
		transform: rotate(calc(var(--i) * 45deg));
	}

	.petal {
		position: absolute;
		left: calc(10.7 / 24 * 100%);
		top: calc((9 - var(--length)) / 24 * 100%);
		width: calc(2.6 / 24 * 100%);
		height: calc(var(--length) / 24 * 100%);
		border-radius: 999px;
		background: currentColor;
		transform-origin: 50% 100%;
		transform: scaleY(0.707);
	}

	/* The whole spark turns once every four flares. */
	.turn {
		animation: turn calc(var(--_duration) * 4) linear infinite;
		animation-play-state: var(--_play-state);
	}

	/* The flare runs round the spark, each petal an eighth of a loop behind the last. */
	.petal {
		animation: flare var(--_duration) infinite;
		animation-delay: calc(var(--_duration) * (var(--i) / -8));
		animation-play-state: var(--_play-state);
	}

	@keyframes turn {
		to {
			transform: rotate(1turn);
		}
	}

	/* A quick flare out, then a slow draw back in. */
	@keyframes flare {
		0%,
		100% {
			transform: scaleY(0.707);
			animation-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
		}
		25% {
			transform: scaleY(1.414);
			animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.turn,
		.petal {
			animation-play-state: paused;
		}
	}
</style>
