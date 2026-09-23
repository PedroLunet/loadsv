/** Default width and height of every spinner, in pixels. */
export const DEFAULT_SIZE = 20;

/**
 * Default loop length of each spinner, in milliseconds.
 * The single definition: spinners read their fallback from here, and so does the site.
 */
export const durations = {} satisfies Record<string, number>;

export type SpinnerName = keyof typeof durations;
