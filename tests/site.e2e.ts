import { expect, test, type APIRequestContext, type Page } from '@playwright/test';
import { SITE_URL } from '../src/site/links';

/** Every spinner the site publishes, in order, read from llms.txt so tests never hardcode the catalog. */
async function published(request: APIRequestContext) {
	const text = await (await request.get('/llms.txt')).text();
	const entries = [...text.matchAll(/^- \[(.+?)\]\((\/spinners\/.+?\.md)\)/gm)];
	return entries.map(([, name, markdown]) => ({ name, markdown }));
}

/** Fails the test on any console error, which is where hydration mismatches surface. */
function watchConsole(page: Page) {
	const errors: string[] = [];
	page.on('console', (message) => {
		if (message.type() === 'error') errors.push(message.text());
	});
	page.on('pageerror', (error) => errors.push(error.message));
	return errors;
}

/**
 * Pages are prerendered, so they're visible before they're interactive. The search button's
 * shortcut hint renders on mount, which makes it a reliable signal that hydration is done.
 */
async function hydrated(page: Page) {
	await expect(page.locator('kbd', { hasText: 'K' }).first()).toBeAttached();
}

/** How every spinner in the main content is animating: the root's own animation and its children's play states. */
function motion(page: Page) {
	return page.locator('main .lsv').evaluateAll((roots) =>
		roots.map((root) => ({
			root: getComputedStyle(root).animationName,
			children: [...root.querySelectorAll('*')]
				.map((el) => getComputedStyle(el))
				.filter((style) => style.animationName !== 'none')
				.flatMap((style) => style.animationPlayState.split(', '))
		}))
	);
}

test.describe('home', () => {
	test('indexes every spinner, linking to its page', async ({ page, request }) => {
		const errors = watchConsole(page);
		const spinners = await published(request);
		await page.goto('/');

		await expect(page.getByRole('heading', { level: 1 })).toHaveText('loadsv');
		const index = page.locator('#spinners').getByRole('link');
		await expect(index).toContainText(spinners.map((s) => s.name));

		await index.filter({ hasText: 'Bouncing dots' }).click();
		await expect(page).toHaveURL('/spinners/bouncing-dots');
		await expect(page.getByRole('heading', { level: 1 })).toContainText('Bouncing dots');
		expect(errors).toEqual([]);
	});

	test('picking a spinner runs the demo with it and rewrites the code', async ({ page }) => {
		const errors = watchConsole(page);
		await page.goto('/');
		await hydrated(page);
		const section = page.locator('section', {
			has: page.getByRole('heading', { name: 'In a button' })
		});
		const ring = section
			.getByRole('group', { name: 'Spinner in the button' })
			.getByRole('button', { name: 'Ring', exact: true });

		await ring.click();
		await expect(ring).toHaveAttribute('aria-pressed', 'true');
		await expect(section.getByRole('button', { name: 'Saving…' })).toBeVisible();
		await expect(section.locator('pre')).toContainText('{#if saving}<Ring size={14} />{/if}');
		expect(errors).toEqual([]);
	});

	test('spinners are hidden from assistive technology', async ({ page }) => {
		for (const path of ['/', '/browse', '/in-an-app']) {
			await page.goto(path);
			const spinners = await page.locator('main .lsv').all();
			expect(spinners.length, path).toBeGreaterThan(0);
			for (const spinner of spinners) {
				await expect(spinner).toHaveAttribute('aria-hidden', 'true');
			}
		}
	});
});

test.describe('browse', () => {
	test('shows every spinner once, by itself, linking to its page', async ({ page, request }) => {
		const errors = watchConsole(page);
		const spinners = await published(request);
		await page.goto('/browse');

		// Spark, the library's mark, leads the grid.
		const links = page.getByRole('main').getByRole('listitem').getByRole('link');
		await expect(links.first()).toHaveText('Spark');
		const hrefs = await links.evaluateAll((all) => all.map((link) => link.getAttribute('href')));
		expect(hrefs.sort()).toEqual(spinners.map((s) => s.markdown.replace(/\.md$/, '')).sort());

		await links.filter({ hasText: 'Inchworm' }).click();
		await expect(page).toHaveURL('/spinners/inchworm');
		expect(errors).toEqual([]);
	});
});

test.describe('in an app', () => {
	test('shows every spinner once, in context, linking to its page', async ({ page, request }) => {
		const errors = watchConsole(page);
		const spinners = await published(request);
		await page.goto('/in-an-app');

		const links = page.getByRole('main').getByRole('listitem').getByRole('link');
		const hrefs = await links.evaluateAll((all) => all.map((link) => link.getAttribute('href')));
		expect(hrefs.sort()).toEqual(spinners.map((s) => s.markdown.replace(/\.md$/, '')).sort());

		await links.filter({ hasText: 'Hourglass' }).click();
		await expect(page).toHaveURL('/spinners/hourglass');
		expect(errors).toEqual([]);
	});
});

test.describe('view dock', () => {
	/** The dock, its toggle, and the menu the toggle opens (inert while closed). */
	async function dockOf(page: Page) {
		const dock = page.getByRole('navigation', { name: 'Views' });
		const toggle = dock.getByRole('button', { name: /^Views/ });
		const menu = page.locator(`#${await toggle.getAttribute('aria-controls')}`);
		return { dock, toggle, menu };
	}

	test('opens onto the views, switches between them and marks the one you are on', async ({
		page
	}) => {
		const errors = watchConsole(page);
		await page.goto('/');
		await hydrated(page);
		const { dock, toggle, menu } = await dockOf(page);
		await expect(toggle).toHaveAccessibleName('Views, now Try it');
		await expect(toggle).toHaveAttribute('aria-expanded', 'false');
		await expect(menu).toHaveJSProperty('inert', true);

		for (const [name, path] of [
			['Browse', '/browse'],
			['In an app', '/in-an-app'],
			['Try it', '/']
		]) {
			await toggle.click();
			await expect(toggle).toHaveAttribute('aria-expanded', 'true');
			await expect(menu).toHaveJSProperty('inert', false);
			await dock.getByRole('link', { name }).click();
			await expect(page).toHaveURL(path);
			await expect(toggle).toHaveAttribute('aria-expanded', 'false');
			await expect(toggle).toHaveAccessibleName(`Views, now ${name}`);
			await expect(dock.getByRole('link', { name })).toHaveAttribute('aria-current', 'page');
			await expect(dock.locator('[aria-current]')).toHaveCount(1);
		}
		expect(errors).toEqual([]);
	});

	test('closes on Escape, handing focus back, and on a click outside', async ({ page }) => {
		await page.goto('/browse');
		await hydrated(page);
		const { dock, toggle } = await dockOf(page);

		await toggle.click();
		await page.keyboard.press('Tab');
		await expect(dock.getByRole('link', { name: 'Try it' })).toBeFocused();
		await page.keyboard.press('Escape');
		await expect(toggle).toHaveAttribute('aria-expanded', 'false');
		await expect(toggle).toBeFocused();

		await toggle.click();
		await expect(toggle).toHaveAttribute('aria-expanded', 'true');
		await page.mouse.click(8, 8);
		await expect(toggle).toHaveAttribute('aria-expanded', 'false');
	});

	test('leaves the page above it clickable while closed', async ({ page }) => {
		await page.goto('/browse');
		await hydrated(page);
		const bar = (await page.getByRole('navigation', { name: 'Views' }).boundingBox())!;
		const covered = await page.evaluate(
			([x, y]) => !!document.elementFromPoint(x, y)?.closest('nav'),
			[bar.x + bar.width / 2, bar.y - 60]
		);
		expect(covered).toBe(false);
	});

	test.describe('before JavaScript runs', () => {
		test.use({ javaScriptEnabled: false });

		test('marks the current view and opens on hover', async ({ page }) => {
			await page.goto('/browse');
			const { dock, toggle, menu } = await dockOf(page);
			await expect(toggle).toHaveAccessibleName('Views, now Browse');
			await expect(toggle).not.toHaveAttribute('aria-expanded');
			await expect(dock.getByRole('link', { name: 'Browse' })).toHaveAttribute(
				'aria-current',
				'page'
			);

			// The menu is clipped away until hovering reveals it; once it has, a card takes the click.
			await dock.hover();
			await expect(menu.locator('..')).toHaveCSS('clip-path', 'inset(0px round 20px)');
			await dock.getByRole('link', { name: 'In an app' }).click();
			await expect(page).toHaveURL('/in-an-app');
			await expect(dock.getByRole('link', { name: 'In an app' })).toHaveAttribute(
				'aria-current',
				'page'
			);
		});
	});

	test('stays out of the docs, which have the sidebar', async ({ page }) => {
		await page.goto('/spinners/arc');
		await expect(page.getByRole('complementary').first()).toBeVisible();
		await expect(page.getByRole('navigation', { name: 'Views' })).toHaveCount(0);
	});
});

test.describe('spinner page', () => {
	test('customizer rewrites the snippet and resets it', async ({ page }) => {
		const errors = watchConsole(page);
		await page.goto('/spinners/arc');
		await hydrated(page);

		const preview = page.locator('#preview');
		const code = preview.locator('pre');
		const reset = preview.getByRole('button', { name: 'Reset' });

		await expect(code).toContainText('<Arc size={48} />');
		await expect(reset).toBeDisabled();

		// The radios are visually hidden inside their labels, so click what a person would.
		for (const label of ['Large', 'Stacked', 'Flat']) {
			await preview.getByText(label, { exact: true }).click();
			await expect(preview.getByRole('radio', { name: label })).toBeChecked();
		}
		await preview.getByRole('slider', { name: 'Duration' }).press('ArrowRight');

		await expect(code).toContainText('size={64}');
		await expect(code).toContainText('easing="stacked"');
		await expect(code).toContainText('cap="flat"');
		await expect(code).toContainText('duration={850}');
		await expect(preview.locator('.lsv')).toHaveCSS('width', '64px');

		await reset.click();
		await expect(code).toContainText('<Arc size={48} />');
		await expect(code).not.toContainText('easing');
		await expect(reset).toBeDisabled();
		expect(errors).toEqual([]);
	});

	test('play button pauses and resumes the preview', async ({ page }) => {
		await page.goto('/spinners/ring');
		await hydrated(page);
		const preview = page.locator('#preview');
		const spinner = preview.locator('.lsv svg');

		await expect(spinner).toHaveCSS('animation-play-state', 'running');
		await preview.getByRole('button', { name: 'Pause animation' }).click();
		await expect(spinner).toHaveCSS('animation-play-state', 'paused');
		await preview.getByRole('button', { name: 'Play animation' }).click();
		await expect(spinner).toHaveCSS('animation-play-state', 'running');
	});

	test('copies the snippet', async ({ page, context }) => {
		await context.grantPermissions(['clipboard-read', 'clipboard-write']);
		await page.goto('/spinners/wave');
		await hydrated(page);

		await page.locator('#preview').getByRole('button', { name: 'Copy code' }).click();
		const copied = await page.evaluate(() => navigator.clipboard.readText());
		expect(copied).toBe(
			"<script>\n\timport { Wave } from 'loadsv';\n</script>\n\n<Wave size={48} />"
		);
	});

	test('links to its neighbours in catalog order, wrapping around', async ({ page }) => {
		await page.goto('/');
		const hrefs = await page
			.locator('#spinners')
			.getByRole('link')
			.evaluateAll((links) => links.map((link) => link.getAttribute('href')));

		await page.goto(hrefs[0]!);
		const nav = page.getByRole('navigation', { name: 'Other spinners' });
		await expect(nav.getByRole('link', { name: /Previous/ })).toHaveAttribute(
			'href',
			hrefs.at(-1)!
		);
		await nav.getByRole('link', { name: /Next/ }).click();
		await expect(page).toHaveURL(hrefs[1]!);
	});

	test('only offers options the spinner has', async ({ page }) => {
		await page.goto('/spinners/dual');
		const preview = page.locator('#preview');
		await expect(preview.getByRole('group', { name: 'Cap' })).toBeVisible();
		await expect(preview.getByRole('group', { name: 'Easing' })).toHaveCount(0);
	});
});

test.describe('search', () => {
	test('opens with the shortcut and navigates with the keyboard', async ({ page }) => {
		await page.goto('/');
		await hydrated(page);
		const dialog = page.getByRole('dialog', { name: 'Search spinners' });
		const input = dialog.getByRole('combobox', { name: 'Search spinners' });

		await page.keyboard.press('ControlOrMeta+k');
		await expect(dialog).toBeVisible();
		await expect(input).toBeFocused();

		// Ribbon, Ring and Ripple start with "ri", so they lead; descriptions mentioning rings follow.
		await input.fill('ri');
		const options = dialog.getByRole('option');
		await expect(options.nth(0)).toContainText('Ribbon');
		await expect(options.nth(1)).toContainText('Ring');
		await expect(options.nth(2)).toContainText('Ripple');
		await expect(options.first()).toHaveAttribute('aria-selected', 'true');

		await input.press('ArrowDown');
		await expect(options.nth(1)).toHaveAttribute('aria-selected', 'true');
		await expect(input).toHaveAttribute('aria-activedescendant', /ring$/);

		await input.press('Enter');
		await expect(page).toHaveURL('/spinners/ring');
		await expect(dialog).toBeHidden();
	});

	test('ranks names above descriptions and says when nothing matches', async ({ page }) => {
		await page.goto('/');
		await hydrated(page);
		await page.getByRole('button', { name: /Search/ }).click();
		const dialog = page.getByRole('dialog', { name: 'Search spinners' });
		const input = dialog.getByRole('combobox');

		// "Ring" matches by name; "Pulse" and "Ripple" only mention rings.
		await input.fill('ring');
		await expect(dialog.getByRole('option').first()).toContainText('Ring');

		// Straight and curly apostrophes match each other.
		await input.fill("newton's");
		await expect(dialog.getByRole('option').first()).toContainText('Newton’s cradle');

		await input.fill('zzz');
		await expect(dialog.getByRole('option')).toHaveCount(0);
		await expect(dialog).toContainText('No spinners match “zzz”.');
	});

	test('closes with Escape and returns focus', async ({ page }) => {
		await page.goto('/');
		await hydrated(page);
		const trigger = page.getByRole('button', { name: /Search/ });
		await trigger.click();
		await expect(page.getByRole('dialog')).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(page.getByRole('dialog')).toBeHidden();
		await expect(trigger).toBeFocused();
	});
});

test.describe('on a phone', () => {
	test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

	test('search opens from the header and closes with Cancel', async ({ page }) => {
		await page.goto('/');
		await hydrated(page);
		await page.getByRole('banner').getByRole('button', { name: 'Search spinners' }).tap();

		const dialog = page.getByRole('dialog', { name: 'Search spinners' });
		const close = dialog.getByRole('button', { name: 'Close search' });
		await expect(close.getByText('Cancel')).toBeVisible();
		await expect(close.getByText('Esc')).toBeHidden();
		await close.tap();
		await expect(dialog).toBeHidden();
	});

	test('keeps the links and credit the sidebar has on desktop', async ({ page }) => {
		for (const path of ['/', '/spinners/arc']) {
			await page.goto(path);
			await expect(page.getByRole('complementary')).toBeHidden();

			const footer = page.getByRole('contentinfo');
			await expect(footer.getByRole('link', { name: 'GitHub' })).toBeVisible();
			await expect(footer.getByRole('link', { name: 'loading.dev' })).toBeVisible();
		}
	});

	test('the customizer stage keeps its height', async ({ page }) => {
		await page.goto('/spinners/arc');
		const box = await page.locator('#preview .lsv').locator('xpath=../..').boundingBox();
		expect(box?.height).toBeGreaterThanOrEqual(200);
	});
});

test.describe('motion', () => {
	// Browse plays every spinner at once; the home page keeps unchosen ones still on purpose.
	test('spinners animate their children, not their root', async ({ page }) => {
		await page.goto('/browse');
		for (const spinner of await motion(page)) {
			expect(spinner.root).toBe('none');
			expect(spinner.children.length).toBeGreaterThan(0);
			expect(spinner.children).not.toContain('paused');
		}
	});

	test.describe('with reduced motion', () => {
		test.use({ reducedMotion: 'reduce' });

		test('spinners hold still and breathe instead', async ({ page }) => {
			await page.goto('/browse');
			for (const spinner of await motion(page)) {
				expect(spinner.root).toMatch(/breathe/);
				expect(spinner.children.length).toBeGreaterThan(0);
				expect(new Set(spinner.children)).toEqual(new Set(['paused']));
			}
		});
	});
});

test.describe('for language models', () => {
	test('llms.txt indexes a Markdown page for every spinner', async ({ request }) => {
		const response = await request.get('/llms.txt');
		expect(response.ok()).toBe(true);
		expect(response.headers()['content-type']).toContain('text/plain');
		expect(await response.text()).toMatch(/^# loadsv\n/);

		const spinners = await published(request);
		expect(spinners.length).toBeGreaterThan(0);
		for (const { name, markdown } of spinners) {
			const page = await request.get(markdown);
			expect(page.ok(), markdown).toBe(true);
			expect((await page.text()).startsWith(`# ${name}\n`), markdown).toBe(true);
		}
	});

	test('every spinner page has a Markdown version', async ({ page, request }) => {
		await page.goto('/spinners/comet');
		const href = await page
			.locator('link[rel="alternate"][type="text/markdown"]')
			.getAttribute('href');
		expect(href).toBe('/spinners/comet.md');

		const response = await request.get(href!);
		expect(response.ok()).toBe(true);
		expect(response.headers()['content-type']).toContain('text/markdown');

		const text = await response.text();
		expect(text).toMatch(/^# Comet\n/);
		expect(text).toContain("import { Comet } from 'loadsv';");
		expect(text).toContain('## Accessibility');
	});
});

test.describe('link previews', () => {
	test('every page describes itself once, at its canonical URL', async ({ page }) => {
		for (const path of ['/', '/browse', '/in-an-app', '/spinners/spark']) {
			await page.goto(path);
			const tag = (selector: string) => page.locator(`head ${selector}`);
			const content = (selector: string) => tag(selector).getAttribute('content');
			for (const selector of ['title', 'link[rel="canonical"]', 'meta[property="og:title"]']) {
				await expect(tag(selector), `${path} ${selector}`).toHaveCount(1);
			}

			expect(await content('meta[property="og:title"]'), path).toBe(await page.title());
			expect(await content('meta[property="og:description"]'), path).toBe(
				await content('meta[name="description"]')
			);
			const canonical = await tag('link[rel="canonical"]').getAttribute('href');
			expect(canonical, path).toBe(new URL(path, SITE_URL).href);
			expect(await content('meta[property="og:url"]'), path).toBe(canonical);
			expect(await content('meta[property="og:image"]'), path).toBe(`${SITE_URL}/og.png`);
			expect(await content('meta[name="twitter:card"]'), path).toBe('summary_large_image');
		}
	});

	test('serves the preview card and the README preview', async ({ request }) => {
		for (const [path, type] of [
			['/og.png', 'image/png'],
			['/preview.svg', 'image/svg+xml']
		]) {
			const response = await request.get(path);
			expect(response.ok(), path).toBe(true);
			expect(response.headers()['content-type'], path).toContain(type);
		}
	});
});

test('unknown pages get a 404 with a way back', async ({ page }) => {
	const response = await page.goto('/spinners/nope');
	expect(response?.status()).toBe(404);
	await expect(page.getByRole('heading', { level: 1 })).toContainText('Nothing to load here.');

	await page.getByRole('link', { name: 'Browse all spinners' }).click();
	await expect(page).toHaveURL('/browse');
});
