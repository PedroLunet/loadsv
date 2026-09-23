import type { Component } from 'svelte';
import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import * as library from './index.js';
import { DEFAULT_SIZE, durations } from './motion.js';

type AnyProps = Record<string, unknown>;

const spinners = Object.entries(library) as [string, Component<AnyProps>][];

function html(spinner: Component<AnyProps>, props: AnyProps = {}) {
	return render(spinner, { props }).body;
}

/** The root element's opening tag. */
function root(spinner: Component<AnyProps>, props: AnyProps = {}) {
	return html(spinner, props).match(/<span[^>]*class="lsv [^>]*>/)![0];
}

function keyOf(spinner: Component<AnyProps>) {
	return root(spinner).match(/lsv-([a-z-]+)/)![1];
}

describe('registry', () => {
	it('exports exactly one spinner per default duration', () => {
		const keys = spinners.map(([, spinner]) => keyOf(spinner)).sort();
		expect(keys).toEqual(Object.keys(durations).sort());
	});
});

describe.each(spinners)('%s', (_, spinner) => {
	it('is hidden from assistive technology', () => {
		expect(root(spinner)).toContain('aria-hidden="true"');
	});

	it('sizes itself from the size prop', () => {
		expect(root(spinner)).toContain(`--lsv-size: ${DEFAULT_SIZE}px`);
		expect(root(spinner, { size: 48 })).toContain('--lsv-size: 48px');
	});

	it('falls back from the duration prop to the cascade to its own default', () => {
		const fallback = durations[keyOf(spinner) as keyof typeof durations];
		expect(root(spinner)).toContain(`--_duration: var(--lsv-duration, ${fallback}ms)`);
		expect(root(spinner, { duration: 1234 })).toContain('--_duration: 1234ms');
	});

	it('falls back from the playState prop to the cascade', () => {
		expect(root(spinner)).toContain('--_play-state: var(--lsv-play-state, running)');
		expect(root(spinner, { playState: 'paused' })).toContain('--_play-state: paused');
	});

	it('only sets a color when one is passed', () => {
		expect(root(spinner)).not.toMatch(/[;"]\s*color:/);
		expect(root(spinner, { color: '#f97316' })).toContain('color: #f97316');
	});

	it('merges classes and forwards attributes', () => {
		const tag = root(spinner, { class: 'opacity-40', 'data-testid': 'spinner' });
		expect(tag).toMatch(/class="lsv lsv-[a-z-]+ opacity-40/);
		expect(tag).toContain('data-testid="spinner"');
	});

	it('keeps a passed style alongside its own', () => {
		const tag = root(spinner, { style: 'margin-inline: 4px' });
		expect(tag).toContain('margin-inline: 4px');
		expect(tag).toContain(`--lsv-size: ${DEFAULT_SIZE}px`);
	});
});

describe('options', () => {
	it.each([library.Arc, library.Ring, library.Dual, library.Snake])(
		'cap switches the stroke ends',
		(spinner) => {
			expect(html(spinner)).toContain('stroke-linecap="round"');
			expect(html(spinner, { cap: 'flat' })).toContain('stroke-linecap="butt"');
		}
	);

	it.each([library.Arc, library.Ring])('easing is exposed to the stylesheet', (spinner) => {
		expect(html(spinner)).toContain('data-easing="linear"');
		expect(html(spinner, { easing: 'stacked' })).toContain('data-easing="stacked"');
	});
});
