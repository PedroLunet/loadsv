import { error } from '@sveltejs/kit';
import { catalog, find } from '$site/catalog';
import { spinnerMarkdown } from '$site/markdown';
import type { EntryGenerator, RequestHandler } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => catalog.map(({ slug }) => ({ slug }));

export const GET: RequestHandler = ({ params }) => {
	const entry = find(params.slug);
	if (!entry) error(404, 'Spinner not found');
	return new Response(spinnerMarkdown(entry), {
		headers: { 'content-type': 'text/markdown; charset=utf-8' }
	});
};
