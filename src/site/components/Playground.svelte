<!--
	The customizable preview at the top of a spinner page. The controls rewrite the
	snippet beneath it, which only ever shows props that differ from the defaults.
	Opacity and playback are ways of looking, not customizations, so they stay out of it.
-->
<script lang="ts">
	import { durations } from '$lib/motion.js';
	import type { PlayState } from '$lib';
	import { componentOf, type Entry } from '$site/catalog';
	import { PREVIEW_SIZE } from '$site/docs';
	import { snippet, type Props } from '$site/snippet';
	import Code from './Code.svelte';
	import Icon from './Icon.svelte';
	import Segmented from './Segmented.svelte';
	import Slider from './Slider.svelte';

	let { entry }: { entry: Entry } = $props();

	const sizes = [
		{ value: 'small', label: 'Small', px: 32 },
		{ value: 'medium', label: 'Medium', px: PREVIEW_SIZE },
		{ value: 'large', label: 'Large', px: 64 }
	] as const;

	/** Matches the page's text color, which is what `currentColor` resolves to. */
	const INHERITED_COLOR = '#0a0a0a';

	// Captured once: the page keys this component by spinner, so a new spinner starts fresh.
	// svelte-ignore state_referenced_locally
	const defaults = {
		size: 'medium' as (typeof sizes)[number]['value'],
		options: Object.fromEntries(entry.options.map((o) => [o.prop, o.defaultValue])),
		color: INHERITED_COLOR,
		duration: durations[entry.slug],
		opacity: 100
	};

	let size = $state(defaults.size);
	let options = $state({ ...defaults.options });
	let color = $state(defaults.color);
	let duration = $state(defaults.duration);
	let opacity = $state(defaults.opacity);
	let playState = $state<PlayState>('running');

	const Spinner = $derived(componentOf(entry));

	/** Exactly what a consumer would write to get what the preview shows. */
	const spinnerProps = $derived.by(() => {
		const result: Props = { size: sizes.find((s) => s.value === size)!.px };
		for (const option of entry.options) {
			if (options[option.prop] !== option.defaultValue) result[option.prop] = options[option.prop];
		}
		if (color !== defaults.color) result.color = color;
		if (duration !== defaults.duration) result.duration = duration;
		return result;
	});

	const lines = $derived(snippet(entry.importName, [spinnerProps]));

	const pristine = $derived(
		size === defaults.size &&
			color === defaults.color &&
			duration === defaults.duration &&
			opacity === defaults.opacity &&
			entry.options.every((o) => options[o.prop] === o.defaultValue)
	);

	function reset() {
		size = defaults.size;
		options = { ...defaults.options };
		color = defaults.color;
		duration = defaults.duration;
		opacity = defaults.opacity;
	}
</script>

<figure class="overflow-hidden rounded-2xl border border-neutral-100">
	<div class="flex flex-col sm:flex-row">
		<div class="relative grid h-64 flex-1 place-items-center bg-neutral-50/60">
			<div style:opacity={opacity / 100}>
				<Spinner {...spinnerProps} {playState} />
			</div>

			<button
				type="button"
				class="absolute bottom-2 left-1/2 grid size-8 -translate-x-1/2 place-items-center rounded-md text-neutral-400 transition-[color,background-color,scale] duration-150 ease-out hover:bg-neutral-200/60 hover:text-neutral-900 active:scale-95"
				aria-label={playState === 'running' ? 'Pause animation' : 'Play animation'}
				onclick={() => (playState = playState === 'running' ? 'paused' : 'running')}
			>
				<Icon name={playState === 'running' ? 'pause' : 'play'} size={14} />
			</button>
		</div>

		<div
			class="flex flex-col gap-1.5 border-t border-neutral-100 p-2 sm:w-52 sm:border-t-0 sm:border-l"
		>
			<Segmented label="Size" options={sizes} bind:value={size} />

			{#each entry.options as option (option.prop)}
				<Segmented label={option.label} options={option.values} bind:value={options[option.prop]} />
			{/each}

			<label
				class="flex h-7 items-center justify-between rounded-lg bg-neutral-100 pr-1 pl-2.5 text-xs has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-svelte"
			>
				<span class="text-neutral-600">Color</span>
				<span class="flex items-center gap-2 font-mono text-[11px] text-neutral-500 uppercase">
					{color}
					<input type="color" class="swatch" bind:value={color} />
				</span>
			</label>

			<Slider
				label="Duration"
				min={Math.round(defaults.duration / 4 / 50) * 50}
				max={defaults.duration * 3}
				step={50}
				bind:value={duration}
				format={(v) => `${v}ms`}
			/>

			<Slider label="Opacity" min={10} max={100} bind:value={opacity} format={(v) => `${v}%`} />

			<button
				type="button"
				class="mt-auto flex h-7 items-center justify-center gap-1.5 rounded-lg text-xs text-neutral-500 transition-[color,background-color,scale,opacity] duration-150 ease-out hover:bg-neutral-100 hover:text-neutral-900 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40"
				disabled={pristine}
				onclick={reset}
			>
				<Icon name="reset" size={12} /> Reset
			</button>
		</div>
	</div>

	<Code {lines} />
</figure>

<style>
	.swatch {
		width: 20px;
		height: 20px;
		padding: 0;
		border: 0;
		border-radius: 5px;
		background: none;
		cursor: pointer;
		appearance: none;
	}

	.swatch::-webkit-color-swatch-wrapper {
		padding: 0;
	}

	.swatch::-webkit-color-swatch {
		border: 1px solid rgb(0 0 0 / 0.08);
		border-radius: 5px;
	}

	.swatch::-moz-color-swatch {
		border: 1px solid rgb(0 0 0 / 0.08);
		border-radius: 5px;
	}
</style>
