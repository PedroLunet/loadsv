import { DEFAULT_SIZE, durations } from '$lib/motion.js';
import type { Entry, Option } from './catalog';
import type { Props } from './snippet';

/**
 * One section of a spinner page. Shared by the page and its Markdown version,
 * so both always say the same thing. `body` marks inline code with backticks.
 */
export interface Section {
	id: string;
	title: string;
	body: string;
	/** Props of each spinner the demo shows; its code is generated from the same props. */
	demo?: Props[];
}

/** What the opening snippet shows before any control is touched. */
export const PREVIEW_SIZE = 48;

const optionCopy: Record<Option['prop'], string> = {
	easing:
		'Controls how the spinner moves through each turn. `linear` keeps a constant speed, `ease-in-out` speeds up and slows down, and `stacked` layers the two so the speed swells without ever stopping.',
	cap: 'Controls how the ends of the stroke are drawn. `round` finishes them with a half circle, `flat` cuts them square.'
};

export function sections(entry: Entry): Section[] {
	const duration = durations[entry.slug];

	return [
		{
			id: 'size',
			title: 'Size',
			body: `Sets the width and height in pixels. The default is \`${DEFAULT_SIZE}\`.`,
			demo: [{ size: 16 }, { size: 24 }, { size: 40 }]
		},
		{
			id: 'custom-classes',
			title: 'Custom classes',
			body: 'Pass a `class` to adjust a spinner beyond what the props cover. The library’s own styles carry no specificity, so your classes always win.',
			demo: [{ class: 'opacity-40', size: 32 }]
		},
		{
			id: 'color',
			title: 'Color',
			body: 'Spinners paint with `currentColor`, so they follow the text color around them. Pass any CSS color to tint one directly.',
			demo: [{ color: '#ff3e00', size: 32 }]
		},
		{
			id: 'duration',
			title: 'Duration',
			body: `Sets the length of one loop in milliseconds. Higher is slower. The default for this spinner is \`${duration}\`. Set \`--lsv-duration\` on any ancestor to change every spinner inside it.`,
			demo: [{ duration: duration * 2, size: 32 }]
		},
		{
			id: 'state',
			title: 'State',
			body: 'Pauses or resumes the animation with `paused` or `running`. Setting `--lsv-play-state` on an ancestor does the same for a whole subtree.',
			demo: [{ playState: 'paused', size: 32 }]
		},
		...entry.options.map((option) => ({
			id: option.prop,
			title: option.label,
			body: `${optionCopy[option.prop]} The default is \`${option.defaultValue}\`.`,
			demo: option.values.map(({ value }) => ({ [option.prop]: value, size: 32 }))
		})),
		{
			id: 'accessibility',
			title: 'Accessibility',
			body: 'Spinners are decorative and hidden from assistive technology, so announce loading on the element that is busy, for example with `aria-busy` and visually hidden text. When reduced motion is on, spinners hold still and gently pulse instead.'
		}
	];
}
