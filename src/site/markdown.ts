import { catalog, type Entry, type Option } from './catalog';
import { PREVIEW_SIZE, sections } from './docs';
import { GITHUB_URL, NPM_URL } from './links';
import { snippet, toText, type Line } from './snippet';

const fence = (lines: Line[], lang = 'svelte') => `\`\`\`${lang}\n${toText(lines)}\n\`\`\``;

export const markdownPath = (entry: Entry) => `/spinners/${entry.slug}.md`;

/** A spinner page as Markdown: the same prose, with each demo replaced by its code. */
export function spinnerMarkdown(entry: Entry): string {
	const parts = [
		`# ${entry.name}`,
		entry.description,
		fence(snippet(entry.importName, [{ size: PREVIEW_SIZE }]))
	];

	for (const section of sections(entry)) {
		parts.push(`## ${section.title}`, section.body);
		if (section.demo) parts.push(fence(snippet(entry.importName, section.demo)));
	}

	return `${parts.join('\n\n')}\n`;
}

function takes(prop: Option['prop']) {
	const names = catalog
		.filter((entry) => entry.options.some((option) => option.prop === prop))
		.map((entry) => entry.importName);
	return `\`${prop}\` (${names.join(', ')})`;
}

/** The site index for language models, per https://llmstxt.org. */
export function llmsTxt(): string {
	const list = catalog
		.map(
			(entry) =>
				`- [${entry.name}](${markdownPath(entry)}): ${entry.description} Import as \`${entry.importName}\`.`
		)
		.join('\n');

	return `# loadsv

> A lightweight library of beautiful loading indicators for Svelte.

${fence([[{ kind: 'plain', text: 'npm install loadsv' }]], 'sh')}

${fence(snippet('Arc', [{ size: 16 }]))}

Every spinner accepts \`size\`, \`color\`, \`duration\` and \`playState\`, and forwards any other attribute to its root \`<span>\`. Some also take ${takes('easing')} or ${takes('cap')}.

\`--lsv-duration\` and \`--lsv-play-state\` set on any ancestor drive every spinner inside it; props win over the cascade.

Spinners are decorative and \`aria-hidden\`, respect reduced motion out of the box, and require Svelte 5.

## Spinners

${list}

## Optional

- [GitHub](${GITHUB_URL}): Source and issues.
- [npm](${NPM_URL}): The package itself.
`;
}
