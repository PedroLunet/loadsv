import { llmsTxt } from '$site/markdown';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = () =>
	new Response(llmsTxt(), { headers: { 'content-type': 'text/plain; charset=utf-8' } });
