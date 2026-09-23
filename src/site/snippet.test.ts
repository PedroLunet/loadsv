import { describe, expect, it } from 'vitest';
import { snippet, toText } from './snippet.js';

describe('snippet', () => {
	it('renders a single spinner without a wrapper', () => {
		expect(toText(snippet('Arc', [{ size: 48 }]))).toBe(
			["<script>", "\timport { Arc } from 'loadsv';", '</script>', '', '<Arc size={48} />'].join(
				'\n'
			)
		);
	});

	it('wraps several spinners in a row', () => {
		expect(toText(snippet('Ring', [{ cap: 'round' }, { cap: 'flat' }]))).toBe(
			[
				'<script>',
				"\timport { Ring } from 'loadsv';",
				'</script>',
				'',
				'<div class="flex items-center gap-6">',
				'\t<Ring cap="round" />',
				'\t<Ring cap="flat" />',
				'</div>'
			].join('\n')
		);
	});

	it('writes numbers as expressions and strings as attributes', () => {
		const line = snippet('Arc', [{ size: 32, color: '#ff3e00' }]).at(-1)!;
		expect(line.filter((token) => token.kind === 'number').map((token) => token.text)).toEqual([
			'32'
		]);
		expect(line.filter((token) => token.kind === 'string').map((token) => token.text)).toEqual([
			'"#ff3e00"'
		]);
	});
});
