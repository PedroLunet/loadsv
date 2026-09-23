import type { HTMLAttributes } from 'svelte/elements';

export type PlayState = 'running' | 'paused';

/** How a rotating spinner moves through each turn. */
export type Easing = 'linear' | 'ease-in-out' | 'stacked';

/** How the ends of a stroke are drawn. */
export type Cap = 'round' | 'flat';

/** Props every spinner accepts. Extra attributes land on the root `<span>`. */
export interface SpinnerProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children' | 'color'> {
	/** Width and height in pixels. Defaults to `20`. */
	size?: number;
	/** Any CSS color. Defaults to `currentColor`. */
	color?: string;
	/** Length of one loop in milliseconds. Each spinner has its own default. */
	duration?: number;
	/** Pauses or resumes the animation. Defaults to `running`. */
	playState?: PlayState;
}
