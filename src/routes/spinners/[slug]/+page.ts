import { error } from '@sveltejs/kit';
import { catalog, find } from '$site/catalog';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => catalog.map(({ slug }) => ({ slug }));

export const load: PageLoad = ({ params }) => {
	const entry = find(params.slug);
	if (!entry) error(404, 'Spinner not found');
	return { entry };
};
