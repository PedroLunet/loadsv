import type { Component } from 'svelte';
import * as loadsv from '$lib';
import type { SpinnerName } from '$lib/motion.js';

/** A prop a spinner has beyond the shared ones, and how the site presents it. */
export interface Option {
	prop: 'easing' | 'cap';
	label: string;
	values: readonly { value: string; label: string }[];
	defaultValue: string;
}

export interface Entry {
	/** The spinner's key in the library, and its URL segment. */
	slug: SpinnerName;
	/** Display name. */
	name: string;
	/** Named export in `loadsv`. */
	importName: keyof typeof loadsv;
	description: string;
	options: readonly Option[];
}

const easing: Option = {
	prop: 'easing',
	label: 'Easing',
	values: [
		{ value: 'linear', label: 'Linear' },
		{ value: 'ease-in-out', label: 'Eased' },
		{ value: 'stacked', label: 'Stacked' }
	],
	defaultValue: 'linear'
};

const cap: Option = {
	prop: 'cap',
	label: 'Cap',
	values: [
		{ value: 'round', label: 'Round' },
		{ value: 'flat', label: 'Flat' }
	],
	defaultValue: 'round'
};

/** Every spinner the site shows. The order here is the order everywhere. */
export const catalog: readonly Entry[] = [
	{
		slug: 'arc',
		name: 'Arc',
		importName: 'Arc',
		description: 'A single open stroke rotating in a circle.',
		options: [easing, cap]
	},
	{
		slug: 'blocks',
		name: 'Blocks',
		importName: 'Blocks',
		description: 'Nine blocks shrinking and growing in a sweep across a grid.',
		options: []
	},
	{
		slug: 'bouncing-dots',
		name: 'Bouncing dots',
		importName: 'BouncingDots',
		description: 'Three staggered dots bouncing up and down.',
		options: []
	},
	{
		slug: 'circular-dots',
		name: 'Circular dots',
		importName: 'CircularDots',
		description: 'Eight dots in a ring, the brightest hopping from one to the next.',
		options: []
	},
	{
		slug: 'classic',
		name: 'Classic',
		importName: 'Classic',
		description: 'Twelve fading bars arranged in a radial pattern.',
		options: []
	},
	{
		slug: 'clock',
		name: 'Clock',
		importName: 'Clock',
		description: 'Two hands on a faint dial, one sweeping, one creeping.',
		options: []
	},
	{
		slug: 'comet',
		name: 'Comet',
		importName: 'Comet',
		description: 'A full ring fading into its tail.',
		options: []
	},
	{
		slug: 'dual',
		name: 'Dual',
		importName: 'Dual',
		description: 'Two arcs turning in opposite directions.',
		options: [cap]
	},
	{
		slug: 'flip',
		name: 'Flip',
		importName: 'Flip',
		description: 'A square flipping over on one axis, then the other.',
		options: []
	},
	{
		slug: 'linear-dots',
		name: 'Linear dots',
		importName: 'LinearDots',
		description: 'Three dots lighting up in turn from left to right.',
		options: []
	},
	{
		slug: 'pulse',
		name: 'Pulse',
		importName: 'Pulse',
		description: 'A ring rippling outward from a dot.',
		options: []
	},
	{
		slug: 'ring',
		name: 'Ring',
		importName: 'Ring',
		description: 'An arc rotating in a faint circle.',
		options: [easing, cap]
	},
	{
		slug: 'ripple',
		name: 'Ripple',
		importName: 'Ripple',
		description: 'Three rings spreading out from the center.',
		options: []
	},
	{
		slug: 'swirl',
		name: 'Swirl',
		importName: 'Swirl',
		description: 'A bright cell gliding round the edge of a grid, trailing light.',
		options: []
	},
	{
		slug: 'wave',
		name: 'Wave',
		importName: 'Wave',
		description: 'Five bars rising and falling in a wave.',
		options: []
	}
];

// Svelte's generated prop types differ per spinner; the site only ever passes valid props.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnySpinner = Component<any>;

export function componentOf(entry: Entry): AnySpinner {
	return loadsv[entry.importName] as AnySpinner;
}

export function find(slug: string): Entry | undefined {
	return catalog.find((entry) => entry.slug === slug);
}

/** Previous and next entries, wrapping around. */
export function neighbours(entry: Entry): [Entry, Entry] {
	const i = catalog.indexOf(entry);
	const n = catalog.length;
	return [catalog[(i - 1 + n) % n], catalog[(i + 1) % n]];
}
