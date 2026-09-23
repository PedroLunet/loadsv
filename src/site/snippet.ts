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

	lines.push([t('punct', '<'), t('tag', 'div'), t('plain', ' '), ...prop('class', ROW_CLASS), t('punct', '>')]);
	for (const props of elements) lines.push(element(importName, props, '\t'));
	lines.push([t('punct', '</'), t('tag', 'div'), t('punct', '>')]);
	return lines;
}

export function toText(lines: Line[]): string {
	return lines.map((line) => line.map((token) => token.text).join('')).join('\n');
}
