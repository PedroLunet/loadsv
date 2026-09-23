import { describe, expect, it } from 'vitest';
import { highlight, snippet, toText } from './snippet.js';

describe('snippet', () => {
	it('renders a single spinner without a wrapper', () => {
		expect(toText(snippet('Arc', [{ size: 48 }]))).toBe(
			['<script>', "\timport { Arc } from 'loadsv';", '</script>', '', '<Arc size={48} />'].join(
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

describe('highlight', () => {
	const source = [
		'<button disabled={saving}>',
		'\t{#if saving}<Arc size={14} />{/if}',
		"\t{saving ? 'Saving…' : 'Save'}",
		'</button>'
	].join('\n');

	const kinds = (kind: string) =>
		highlight(source)
			.flat()
			.filter((token) => token.kind === kind)
			.map((token) => token.text);

	it('keeps the source exactly', () => {
		expect(toText(highlight(source))).toBe(source);
	});

	it('colours tags, attributes, block keywords, numbers and strings', () => {
		expect(kinds('tag')).toEqual(['button', 'Arc', 'button']);
		expect(kinds('attr')).toEqual(['disabled', 'size']);
		expect(kinds('keyword')).toEqual(['if', 'if']);
		expect(kinds('number')).toEqual(['14']);
		expect(kinds('string')).toEqual(["'Saving…'", "'Save'"]);
	});

	it('knows import statements', () => {
		const [line] = highlight("import { Arc } from 'loadsv';");
		expect(line.filter((token) => token.kind === 'keyword').map((token) => token.text)).toEqual([
			'import',
			'from'
		]);
	});
});
