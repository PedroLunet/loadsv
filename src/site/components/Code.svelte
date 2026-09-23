<script lang="ts">
	import { toText, type Line, type TokenKind } from '$site/snippet';
	import CopyButton from './CopyButton.svelte';

	let { lines }: { lines: Line[] } = $props();

	const colors: Record<TokenKind, string> = {
		plain: 'text-neutral-800',
		punct: 'text-neutral-400',
		keyword: 'text-[#c2410c]',
		string: 'text-[#0369a1]',
		number: 'text-[#15803d]',
		tag: 'text-[#7c3aed]',
		attr: 'text-neutral-800'
	};
</script>

<div class="relative">
	<!-- Whitespace inside <pre> is significant, so every line is written on one line. -->
	<pre
		class="overflow-x-auto py-3.5 pr-12 font-mono text-[12.5px] leading-[1.75] [tab-size:2]"><code
			>{#each lines as line, i (i)}<span class="flex"
					><span
						class="w-10 shrink-0 pr-4 text-right text-neutral-300 tabular-nums select-none"
						aria-hidden="true">{i + 1}</span
					><span class="whitespace-pre"
						>{#each line as token, j (j)}<span class={colors[token.kind]}>{token.text}</span
							>{/each}</span
					></span
				>{/each}</code
		></pre>
	<CopyButton text={() => toText(lines)} label="Copy code" class="absolute top-2 right-2" />
</div>
