/** Default width and height of every spinner, in pixels. */
export const DEFAULT_SIZE = 20;

/**
 * Default loop length of each spinner, in milliseconds.
 * The single definition: spinners read their fallback from here, and so does the site.
 */
export const durations = {
	arc: 800,
	ring: 800,
	dual: 1000,
	comet: 800,
	classic: 1000,
	'bouncing-dots': 1000,
	'linear-dots': 1000,
	wave: 1000,
	pulse: 1200,
	ripple: 1800,
	blocks: 1200,
	flip: 1600,
	clock: 1000,
	'circular-dots': 800,
	swirl: 1000,
	eclipse: 1400,
	'infinity-loop': 1600
} satisfies Record<string, number>;

export type SpinnerName = keyof typeof durations;
