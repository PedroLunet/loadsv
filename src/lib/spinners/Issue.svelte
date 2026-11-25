<!--
	@component
	A GitHub issue icon whose dashes flow into a solid ring, then break apart again.
-->
<script lang="ts">
	import Root from '../internal/Root.svelte';
	import { durations } from '../motion.js';
	import type { SpinnerProps } from '../types.js';

	let props: SpinnerProps = $props();
</script>

<!--
	One ring, cut into eight dashes. The dashes grow until their gaps close completely and
	the round ends overlap into a clean circle; then they shrink back and the gaps reopen.
	Around the open peak the dot and the ring share one slow pump before the ring breaks
	apart again. The whole icon turns slowly throughout, so it never sits still.
-->
<Root name="issue" defaultDuration={durations.issue} {...props}>
	<span class="lsv-issue-turn">
		<span class="lsv-issue-beat">
			<svg class="lsv-issue-ring" viewBox="0 0 24 24" fill="none">
				<circle
					class="lsv-issue-gaps"
					cx="12"
					cy="12"
					r="9.5"
					stroke="currentColor"
					stroke-width="1.8"
					stroke-linecap="round"
					stroke-dasharray="7.47 0"
				/>
			</svg>
			<span class="lsv-issue-ball"><span class="lsv-issue-dot"></span></span>
		</span>
	</span>
</Root>

<style>
	.lsv-issue-turn,
	.lsv-issue-beat,
	.lsv-issue-ring,
	.lsv-issue-ball {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.lsv-issue-turn {
		animation: turn var(--_duration) linear infinite;
		animation-play-state: var(--_play-state);
	}

	.lsv-issue-beat {
		transform-origin: 50% 50%;
		animation: beat var(--_duration) ease-in-out infinite;
		animation-play-state: var(--_play-state);
	}

	.lsv-issue-ring {
		display: block;
	}

	/*
	 * Eight periods of 7.46 fit the circumference exactly. At 7.47 the dashes overlap into
	 * one clean circle; at 2.86 the gaps are open and the dashes show. Growing one and
	 * shrinking the other keeps eight dashes all the way through.
	 */
	.lsv-issue-gaps {
		animation: flow var(--_duration) linear infinite;
		animation-play-state: var(--_play-state);
	}

	.lsv-issue-ball {
		transform-origin: 50% 50%;
		animation: ball var(--_duration) infinite;
		animation-play-state: var(--_play-state);
	}

	.lsv-issue-dot {
		position: absolute;
		top: 50%;
		left: 50%;
		width: calc(var(--lsv-size) * 3.6 / 24);
		height: calc(var(--lsv-size) * 3.6 / 24);
		translate: -50% -50%;
		border-radius: 50%;
		background: currentColor;
		animation: pulse var(--_duration) ease-in-out infinite;
		animation-play-state: var(--_play-state);
	}

	@keyframes turn {
		to {
			transform: rotate(0.5turn);
		}
	}

	/*
	 * The two states are the turning points of one continuous flow: fully solid at the
	 * top of the loop, fully dashed in the middle, and always on the way to one or the
	 * other. The ease slows at each end, so the open and draft moments read without a hold.
	 */
	@keyframes flow {
		0% {
			stroke-dasharray: 7.47 0;
			animation-timing-function: cubic-bezier(0.37, 0, 0.63, 1);
		}
		50% {
			stroke-dasharray: 2.86 4.6;
			animation-timing-function: cubic-bezier(0.37, 0, 0.63, 1);
		}
		100% {
			stroke-dasharray: 7.47 0;
		}
	}

	/* One slow pump around the solid peak, then it rests while the dashes move. */
	@keyframes beat {
		0% {
			transform: scale(1.04);
			animation-timing-function: cubic-bezier(0.37, 0, 0.63, 1);
		}
		12%,
		88% {
			transform: scale(1);
			animation-timing-function: cubic-bezier(0.37, 0, 0.63, 1);
		}
		100% {
			transform: scale(1.04);
		}
	}

	/*
	 * The dot blooms out of the closing ring and melts back into it as the gaps open.
	 * No overshoot: it should look like the ring grows the dot, not like a separate pop.
	 */
	@keyframes ball {
		0%,
		10% {
			opacity: 1;
			transform: scale(1);
			animation-timing-function: cubic-bezier(0.37, 0, 0.63, 1);
		}
		18%,
		80% {
			opacity: 0;
			transform: scale(0.6);
			animation-timing-function: cubic-bezier(0.37, 0, 0.63, 1);
		}
		90%,
		100% {
			opacity: 1;
			transform: scale(1);
		}
	}

	/* The dot swells a touch with the ring, so the pump belongs to the whole icon. */
	@keyframes pulse {
		0% {
			transform: scale(1.06);
			animation-timing-function: cubic-bezier(0.37, 0, 0.63, 1);
		}
		12%,
		88% {
			transform: scale(1);
			animation-timing-function: cubic-bezier(0.37, 0, 0.63, 1);
		}
		100% {
			transform: scale(1.06);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.lsv-issue-turn,
		.lsv-issue-beat,
		.lsv-issue-ring circle,
		.lsv-issue-ball,
		.lsv-issue-dot {
			animation-play-state: paused;
		}
	}
</style>
