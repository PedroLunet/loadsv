/**
 * Builds the code shown beside every demo as tokens, so the site can colour it
 * without shipping a syntax highlighter. The same props render the demo and the
 * code, so the code a reader sees is always the code that runs.
 */

export type TokenKind = 'plain' | 'punct' | 'keyword' | 'string' | 'number' | 'tag' | 'attr';
export type Token = { kind: TokenKind; text: string };
export type Line = Token[];

export type PropValue = string | number;
export type Props = Record<string, PropValue>;

/** Classes on the wrapper when a demo shows more than one spinner. */
export const ROW_CLASS = 'flex items-center gap-6';

const t = (kind: TokenKind, text: string): Token => ({ kind, text });

function prop(name: string, value: PropValue): Token[] {
	return typeof value === 'number'
		? [t('attr', name), t('punct', '={'), t('number', String(value)), t('punct', '}')]
		: [t('attr', name), t('punct', '='), t('string', `"${value}"`)];
}

function element(importName: string, props: Props, indent: string): Line {
	return [
		t('plain', indent),
		t('punct', '<'),
		t('tag', importName),
		...Object.entries(props).flatMap(([name, value]) => [t('plain', ' '), ...prop(name, value)]),
		t('plain', ' '),
		t('punct', '/>')
	];
}

/** A complete component file rendering one or more spinners. */
export function snippet(importName: string, elements: Props[]): Line[] {
	const lines: Line[] = [
		[t('punct', '<'), t('tag', 'script'), t('punct', '>')],
		[
			t('plain', '\t'),
			t('keyword', 'import'),
			t('plain', ' { '),
			t('plain', importName),
			t('plain', ' } '),
			t('keyword', 'from'),
			t('plain', ' '),
			t('string', "'loadsv'"),
			t('punct', ';')
		],
		[t('punct', '</'), t('tag', 'script'), t('punct', '>')],
		[]
	];

	if (elements.length === 1) {
		lines.push(element(importName, elements[0], ''));
		return lines;
	}

	lines.push([
		t('punct', '<'),
		t('tag', 'div'),
		t('plain', ' '),
		...prop('class', ROW_CLASS),
		t('punct', '>')
	]);
	for (const props of elements) lines.push(element(importName, props, '\t'));
	lines.push([t('punct', '</'), t('tag', 'div'), t('punct', '>')]);
	return lines;
}

const syntax =
	/(<\/?)([A-Za-z][\w.]*)|('[^'\n]*'|"[^"\n]*")|(\{[#:/@])(\w+)|\b(import|from)\b|([A-Za-z][\w:-]*)(?==)|\b(\d+)\b|(\/?>|[{}=;,()?:])|([\s\S])/g;

/**
 * Colours free-form Svelte for examples that aren't a single spinner: tags, attributes,
 * strings, block keywords, numbers and punctuation. Small on purpose; the examples are too.
 */
export function highlight(source: string): Line[] {
	return source.split('\n').map((text) => {
		const line: Line = [];
		const push = (kind: TokenKind, value: string) => {
			const last = line.at(-1);
			if (last?.kind === kind) last.text += value;
			else line.push(t(kind, value));
		};
		for (const m of text.matchAll(syntax)) {
			if (m[1]) {
				push('punct', m[1]);
				push('tag', m[2]);
			} else if (m[3]) push('string', m[3]);
			else if (m[4]) {
				push('punct', m[4]);
				push('keyword', m[5]);
			} else if (m[6]) push('keyword', m[6]);
			else if (m[7]) push('attr', m[7]);
			else if (m[8]) push('number', m[8]);
			else if (m[9]) push('punct', m[9]);
			else push('plain', m[10]);
		}
		return line;
	});
}

export function toText(lines: Line[]): string {
	return lines.map((line) => line.map((token) => token.text).join('')).join('\n');
}
