# loadsv

A lightweight library of beautiful loading indicators for Svelte.

**[See them live](https://loadsv.pedrolu.net)** · [Browse all 28](https://loadsv.pedrolu.net/browse) · [llms.txt](https://loadsv.pedrolu.net/llms.txt)

- **28 spinners**, each a single dependency-free component. The motion is pure CSS: no JavaScript runs while they play.
- **Compositor-only animation.** Everything moves with `transform` and `opacity`, so spinners stay smooth while the page is busy. The one exception is `Snake`, whose arc stretches with `stroke-dasharray` and repaints each frame; its turn still runs on the compositor.
- **Reduced motion built in.** With `prefers-reduced-motion`, spinners hold still and gently breathe instead.
- **Styles you can override.** The library's CSS carries zero specificity, so any class you pass wins.
- **Only what you import.** Spinners are named exports, so the ones you don't use never reach your bundle. Nothing touches the browser, so they render on the server as-is.

## Install

```sh
npm install loadsv
# or: pnpm add loadsv · yarn add loadsv · bun add loadsv
```

Requires Svelte 5.16 or later. No other dependencies.

## Usage

```svelte
<script>
	import { Arc } from 'loadsv';
</script>

<Arc />
<Arc size={32} color="#ff3e00" />
<Arc duration={1200} easing="stacked" />
```

Spinners paint with `currentColor`, so they pick up the text color around them:

```svelte
<button class="text-blue-600">
	<Arc size={16} /> Saving
</button>
```

When a whole area is waiting, give the spinner room and a sentence saying what it's waiting for:

```svelte
{#await invoices}
	<Blocks size={28} />
	<p>Fetching invoices…</p>
{:then rows}
	<InvoiceList {rows} />
{/await}
```

## Spinners

Every spinner is a named export: `import { Spark, Ribbon } from 'loadsv'`. Each name links to its page on the site, with a live playground for every option.

| Component                                                             | Default duration | Extra props     |
| --------------------------------------------------------------------- | ---------------- | --------------- |
| [`Arc`](https://loadsv.pedrolu.net/spinners/arc)                      | 800ms            | `easing`, `cap` |
| [`Atom`](https://loadsv.pedrolu.net/spinners/atom)                    | 1200ms           |                 |
| [`Blocks`](https://loadsv.pedrolu.net/spinners/blocks)                | 1200ms           |                 |
| [`Bounce`](https://loadsv.pedrolu.net/spinners/bounce)                | 900ms            |                 |
| [`BouncingDots`](https://loadsv.pedrolu.net/spinners/bouncing-dots)   | 1000ms           |                 |
| [`CircularDots`](https://loadsv.pedrolu.net/spinners/circular-dots)   | 800ms            |                 |
| [`Classic`](https://loadsv.pedrolu.net/spinners/classic)              | 1000ms           |                 |
| [`Clock`](https://loadsv.pedrolu.net/spinners/clock)                  | 1000ms           |                 |
| [`Comet`](https://loadsv.pedrolu.net/spinners/comet)                  | 800ms            |                 |
| [`Dual`](https://loadsv.pedrolu.net/spinners/dual)                    | 1000ms           | `cap`           |
| [`Eclipse`](https://loadsv.pedrolu.net/spinners/eclipse)              | 1400ms           |                 |
| [`Flip`](https://loadsv.pedrolu.net/spinners/flip)                    | 1600ms           |                 |
| [`Handoff`](https://loadsv.pedrolu.net/spinners/handoff)              | 1800ms           |                 |
| [`Hourglass`](https://loadsv.pedrolu.net/spinners/hourglass)          | 4000ms           |                 |
| [`Inchworm`](https://loadsv.pedrolu.net/spinners/inchworm)            | 2000ms           |                 |
| [`InfinityLoop`](https://loadsv.pedrolu.net/spinners/infinity-loop)   | 1600ms           |                 |
| [`Leap`](https://loadsv.pedrolu.net/spinners/leap)                    | 1500ms           |                 |
| [`LinearDots`](https://loadsv.pedrolu.net/spinners/linear-dots)       | 1000ms           |                 |
| [`NewtonsCradle`](https://loadsv.pedrolu.net/spinners/newtons-cradle) | 1200ms           |                 |
| [`Pulse`](https://loadsv.pedrolu.net/spinners/pulse)                  | 1200ms           |                 |
| [`Ribbon`](https://loadsv.pedrolu.net/spinners/ribbon)                | 1600ms           |                 |
| [`Ring`](https://loadsv.pedrolu.net/spinners/ring)                    | 800ms            | `easing`, `cap` |
| [`Ripple`](https://loadsv.pedrolu.net/spinners/ripple)                | 1800ms           |                 |
| [`Slide`](https://loadsv.pedrolu.net/spinners/slide)                  | 2400ms           |                 |
| [`Snake`](https://loadsv.pedrolu.net/spinners/snake)                  | 1500ms           | `cap`           |
| [`Spark`](https://loadsv.pedrolu.net/spinners/spark)                  | 1400ms           |                 |
| [`Swirl`](https://loadsv.pedrolu.net/spinners/swirl)                  | 1000ms           |                 |
| [`Wave`](https://loadsv.pedrolu.net/spinners/wave)                    | 1000ms           |                 |

## Props

Every spinner accepts:

| Prop        | Type                    | Default        | Description                         |
| ----------- | ----------------------- | -------------- | ----------------------------------- |
| `size`      | `number`                | `20`           | Width and height in pixels.         |
| `color`     | `string`                | `currentColor` | Any CSS color.                      |
| `duration`  | `number`                | per spinner    | Length of one loop in milliseconds. |
| `playState` | `'running' \| 'paused'` | `'running'`    | Pauses or resumes the animation.    |

Any other attribute, including `class` and `style`, is forwarded to the root `<span>`.

Some spinners take more:

| Prop     | Type                                     | Default    | Description                                                                                           |
| -------- | ---------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------- |
| `easing` | `'linear' \| 'ease-in-out' \| 'stacked'` | `'linear'` | How it moves through each turn. `stacked` layers the other two, so the speed swells without stopping. |
| `cap`    | `'round' \| 'flat'`                      | `'round'`  | How the ends of the stroke are drawn.                                                                 |

Every prop is typed and documented, so your editor explains it on hover. The types are exported too: `SpinnerProps`, `PlayState`, `Easing` and `Cap`.

```ts
import type { SpinnerProps } from 'loadsv';
```

## CSS custom properties

Set these on any ancestor to control every spinner inside it. A prop on a single spinner still wins.

| Property           | Example  | Effect                               |
| ------------------ | -------- | ------------------------------------ |
| `--lsv-duration`   | `1200ms` | Loop length, replacing each default. |
| `--lsv-play-state` | `paused` | Pauses or resumes a whole subtree.   |

```svelte
<!-- Freeze every spinner in a panel while it's collapsed. -->
<section style:--lsv-play-state={open ? 'running' : 'paused'}>…</section>
```

## Accessibility

Spinners are decorative and render with `aria-hidden="true"`, so they never announce anything on their own. Put the loading state on the element that is busy, in words:

```svelte
<button disabled={saving} aria-busy={saving}>
	{#if saving}<Arc size={14} />{/if}
	{saving ? 'Saving…' : 'Save'}
</button>
```

When the user prefers reduced motion, spinners stop moving and fade gently in and out instead, so they still read as "working". There's nothing to configure.

## Credits

Inspired by [loading.dev](https://loading.dev). Same ideas, written from scratch for Svelte.

## Development

The package lives in `src/lib`. The docs site, built with SvelteKit and deployed to Cloudflare Workers, lives in `src/routes` and `src/site`.

```sh
npm install
npm run dev      # docs site with hot reload
npm run lint     # Prettier and ESLint
npm run check    # type-check with svelte-check
npm run test     # unit tests, then end-to-end tests against a production build
npm run package  # build the package into dist/ and lint it with publint
npm run build    # build the docs site
npm run preview  # serve the built site locally with Wrangler
```

Issues and pull requests are welcome on [GitHub](https://github.com/PedroLunet/loadsv/issues).

## License

[MIT](LICENSE) © Pedro Lunet
