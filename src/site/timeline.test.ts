import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { timeline } from './timeline.js';

describe('timeline', () => {
	beforeEach(() => void vi.useFakeTimers());
	afterEach(() => void vi.useRealTimers());

	it('runs steps in order, including ones scheduled by earlier steps', () => {
		const steps: string[] = [];
		const t = timeline();
		t.after(100, () => {
			steps.push('queued');
			t.after(200, () => steps.push('done'));
		});

		vi.advanceTimersByTime(100);
		expect(steps).toEqual(['queued']);
		vi.advanceTimersByTime(200);
		expect(steps).toEqual(['queued', 'done']);
	});

	it('cancels everything still pending when cleared', () => {
		const fn = vi.fn();
		const t = timeline();
		t.after(100, fn);
		t.after(300, fn);

		vi.advanceTimersByTime(100);
		t.clear();
		vi.advanceTimersByTime(1000);
		expect(fn).toHaveBeenCalledOnce();
	});
});
