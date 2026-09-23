<!--
	@component
	The element every spinner renders into. It owns sizing and the motion contract.

	`--lsv-duration` and `--lsv-play-state` cascade from any ancestor, the `duration`
	and `playState` props override them on a single spinner, and the spinner's own
	default comes last. The resolved values reach the spinner's CSS as `--_duration`
	and `--_play-state`, so a spinner never has to know where a value came from.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { DEFAULT_SIZE } from '../motion.js';
	import type { SpinnerProps } from '../types.js';

	interface Props extends SpinnerProps {
		/** Spinner key, used for the `lsv-<name>` class. */
		name: string;
		/** Fallback loop length in milliseconds. */
		defaultDuration: number;
		children: Snippet;
	}

	let {
		name,
		defaultDuration,
		size = DEFAULT_SIZE,
		color,
		duration,
		playState,
		class: className,
		children,
		...rest
	}: Props = $props();
</script>

<span
	aria-hidden="true"
	{...rest}
	class={['lsv', `lsv-${name}`, className]}
	style:--lsv-size="{size}px"
	style:--_duration={duration === undefined
		? `var(--lsv-duration, ${defaultDuration}ms)`
		: `${duration}ms`}
	style:--_play-state={playState ?? 'var(--lsv-play-state, running)'}
	style:color
>
	{@render children()}
</span>

<style>
	/* :where() keeps specificity at zero, so a consumer's own classes always win. */
	:where(.lsv) {
		display: inline-block;
		position: relative;
		flex-shrink: 0;
		width: var(--lsv-size);
		height: var(--lsv-size);
		vertical-align: middle;
	}

	/*
	 * Reduced motion: every spinner holds a still pose and the whole thing breathes,
	 * so it keeps reading as "working" without anything moving. Clamped so a very
	 * short duration can never turn into flashing.
	 */
	@media (prefers-reduced-motion: reduce) {
		:where(.lsv) {
			animation: breathe max(var(--_duration), 800ms) ease-in-out infinite alternate;
			animation-play-state: var(--_play-state);
		}
	}

	@keyframes breathe {
		to {
			opacity: 0.35;
		}
	}
</style>
