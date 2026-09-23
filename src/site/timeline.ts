import { browser } from '$app/environment';

/** Timers that can all be cancelled at once, so a demo never fires after it's gone. */
export function timeline() {
	const timers = new Set<ReturnType<typeof setTimeout>>();
	return {
		after(ms: number, fn: () => void) {
			const id = setTimeout(() => {
				timers.delete(id);
				fn();
			}, ms);
			timers.add(id);
		},
		clear() {
			for (const id of timers) clearTimeout(id);
			timers.clear();
		}
	};
}

/** False while prerendering, where there's no one to ask. */
export function prefersReducedMotion(): boolean {
	return browser && matchMedia('(prefers-reduced-motion: reduce)').matches;
}
