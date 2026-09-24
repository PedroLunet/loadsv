# loadsv

A lightweight library of beautiful loading indicators for Svelte.

- **24 spinners**, each a single dependency-free component. The motion is pure CSS: no JavaScript runs while they play.
- **Compositor-only animation.** Everything moves with `transform` and `opacity`, so spinners stay smooth while the page is busy. The one exception is `Snake`, whose arc stretches with `stroke-dasharray` and repaints each frame; its turn still runs on the compositor.
- **Reduced motion built in.** With `prefers-reduced-motion`, spinners hold still and gently breathe instead.
- **Styles you can override.** The library's CSS carries zero specificity, so any class you pass wins.

## Install

```sh
npm install loadsv
```

Requires Svelte 5.16 or later.

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

## Spinners

| Component       | Default duration | Extra props     |
| --------------- | ---------------- | --------------- |
| `Arc`           | 800ms            | `easing`, `cap` |
| `Atom`          | 1200ms           |                 |
| `Blocks`        | 1200ms           |                 |
| `Bounce`        | 900ms            |                 |
| `BouncingDots`  | 1000ms           |                 |
| `CircularDots`  | 800ms            |                 |
| `Classic`       | 1000ms           |                 |
| `Clock`         | 1000ms           |                 |
| `Comet`         | 800ms            |                 |
| `Dual`          | 1000ms           | `cap`           |
| `Eclipse`       | 1400ms           |                 |
| `Flip`          | 1600ms           |                 |
| `Hourglass`     | 4000ms           |                 |
| `InfinityLoop`  | 1600ms           |                 |
| `Leap`          | 1500ms           |                 |
| `LinearDots`    | 1000ms           |                 |
| `NewtonsCradle` | 1200ms           |                 |
| `Pulse`         | 1200ms           |                 |
| `Ring`          | 800ms            | `easing`, `cap` |
| `Ripple`        | 1800ms           |                 |
| `Slide`         | 2400ms           |                 |
| `Snake`         | 1500ms           | `cap`           |
| `Swirl`         | 1000ms           |                 |
| `Wave`          | 1000ms           |                 |

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

The types are exported too: `SpinnerProps`, `PlayState`, `Easing` and `Cap`.

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
npm run dev      # docs site with hot reload
npm run test     # unit tests, then end-to-end tests against a production build
npm run package  # build the package into dist/ and lint it with publint
npm run build    # build the docs site
npm run preview  # serve the built site locally with Wrangler
```

## License

MIT
