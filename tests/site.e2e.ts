import { expect, test, type APIRequestContext, type Page } from '@playwright/test';

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
 * Pages are prerendered, so they're visible before they're interactive. The sidebar's
 * shortcut hint renders on mount, which makes it a reliable signal that hydration is done.
 */
async function hydrated(page: Page) {
	await expect(page.locator('aside kbd')).toBeAttached();
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

test.describe('overview', () => {
	test('lists every spinner, linking to its page', async ({ page, request }) => {
		const errors = watchConsole(page);
		const spinners = await published(request);
		await page.goto('/');

		await expect(page.getByRole('heading', { level: 1 })).toHaveText('Loading, made for Svelte.');
		const cards = page.getByRole('main').getByRole('link');
		await expect(cards).toHaveText(spinners.map((s) => s.name));

		await cards.filter({ hasText: 'Bouncing dots' }).click();
		await expect(page).toHaveURL('/spinners/bouncing-dots');
		await expect(page.getByRole('heading', { level: 1 })).toContainText('Bouncing dots');
		expect(errors).toEqual([]);
	});

	test('spinners are hidden from assistive technology', async ({ page, request }) => {
		const count = (await published(request)).length;
		await page.goto('/');
		const spinners = page.locator('main .lsv');
		await expect(spinners).toHaveCount(count);
		for (const spinner of await spinners.all()) {
			await expect(spinner).toHaveAttribute('aria-hidden', 'true');
		}
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
			.getByRole('main')
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
		const input = dialog.getByRole('combobox');

		await page.keyboard.press('ControlOrMeta+k');
		await expect(dialog).toBeVisible();
		await expect(input).toBeFocused();

		// Ring and Ripple start with "ri", so they lead; descriptions mentioning rings follow.
		await input.fill('ri');
		const options = dialog.getByRole('option');
		await expect(options.nth(0)).toContainText('Ring');
		await expect(options.nth(1)).toContainText('Ripple');
		await expect(options.first()).toHaveAttribute('aria-selected', 'true');

		await input.press('ArrowDown');
		await expect(options.nth(1)).toHaveAttribute('aria-selected', 'true');
		await expect(input).toHaveAttribute('aria-activedescendant', /ripple$/);

		await input.press('Enter');
		await expect(page).toHaveURL('/spinners/ripple');
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
		await page.goto('/');
		await expect(page.getByRole('complementary')).toBeHidden();

		const footer = page.getByRole('contentinfo');
		await expect(footer.getByRole('link', { name: 'GitHub' })).toBeVisible();
		await expect(footer.getByRole('link', { name: 'loading.dev' })).toBeVisible();
	});

	test('the customizer stage keeps its height', async ({ page }) => {
		await page.goto('/spinners/arc');
		const box = await page.locator('#preview .lsv').locator('xpath=../..').boundingBox();
		expect(box?.height).toBeGreaterThanOrEqual(200);
	});
});

test.describe('motion', () => {
	test('spinners animate their children, not their root', async ({ page }) => {
		await page.goto('/');
		for (const spinner of await motion(page)) {
			expect(spinner.root).toBe('none');
			expect(spinner.children.length).toBeGreaterThan(0);
			expect(spinner.children).not.toContain('paused');
		}
	});

	test.describe('with reduced motion', () => {
		test.use({ reducedMotion: 'reduce' });

		test('spinners hold still and breathe instead', async ({ page }) => {
			await page.goto('/');
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

test('unknown pages get a 404 with a way back', async ({ page }) => {
	const response = await page.goto('/spinners/nope');
	expect(response?.status()).toBe(404);
	await expect(page.getByRole('heading', { level: 1 })).toContainText('Nothing to load here.');

	await page.getByRole('link', { name: 'Browse all spinners' }).click();
	await expect(page).toHaveURL('/');
});
