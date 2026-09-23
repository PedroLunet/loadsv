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
	pulse: 1200
} satisfies Record<string, number>;

export type SpinnerName = keyof typeof durations;
