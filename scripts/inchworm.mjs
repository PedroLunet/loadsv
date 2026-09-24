// Writes src/lib/spinners/Inchworm.svelte.
//
//   node scripts/inchworm.mjs [pills = 12] [pill length = 4]
//
// The keyframes are computed rather than hand-written. Every pill rides a track that is part
// straight, part arc, while following a single easing curve, and CSS only interpolates between
// keyframes. So each pill's easing is split wherever it crosses from straight to curve, and
// each piece gets its own keyframe and its own share of the curve.
//
// Units are the spinner's 24 × 24 viewBox, measured from its centre. The track is the pills'
// centre line: the top edge sits at y = -6, and each corner is an arc of radius 2.5 around
// (±3.5, ±3.5). Only one step is described, from the top's middle, round the top-right corner,
// to the right side's middle. A wrapper turns a quarter each step for the rest.

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const N = Number(process.argv[2] ?? 12); // pills, tail b0 to head b(N - 1)
const W = Number(process.argv[3] ?? 4); // pill length, along the track
if (!Number.isInteger(N) || N < 2 || !(W > 0)) {
	console.error('Usage: node scripts/inchworm.mjs [pills >= 2] [pill length > 0]');
	process.exit(1);
}

const H = 3; // pill thickness
const R = 2.5; // corner radius of the track
const A = 3.5; // half the straight part of an edge
const ARC = (Math.PI / 2) * R;
const L = 2 * A + ARC; // track covered in one step
const THIN = 0.7; // pill scale at full stretch
const EASE = [0.65, 0, 0.35, 1];
const REACH = [6, 50]; // the head moves, as % of the step
const GATHER = [54, 100]; // then the tail follows

const round = (v) => +v.toFixed(3);

// The easing curve, as a cubic Bézier from (0, 0) to (1, 1).
const P = [
	[0, 0],
	[EASE[0], EASE[1]],
	[EASE[2], EASE[3]],
	[1, 1]
];
const bez = (p0, p1, p2, p3, u) =>
	(1 - u) ** 3 * p0 + 3 * (1 - u) ** 2 * u * p1 + 3 * (1 - u) * u ** 2 * p2 + u ** 3 * p3;
const at = (u) => [0, 1].map((i) => bez(P[0][i], P[1][i], P[2][i], P[3][i], u));

// The curve parameter at which progress reaches y.
function uForY(y) {
	let lo = 0;
	let hi = 1;
	for (let i = 0; i < 60; i++) {
		const m = (lo + hi) / 2;
		if (at(m)[1] < y) lo = m;
		else hi = m;
	}
	return (lo + hi) / 2;
}

// The piece of the curve between u0 and u1 (de Casteljau), rescaled to a unit box.
function sub(u0, u1) {
	const lerp = (a, b, t) => a + (b - a) * t;
	const split = ([a, b, c, d], t) => {
		const ab = a.map((v, i) => lerp(v, b[i], t));
		const bc = b.map((v, i) => lerp(v, c[i], t));
		const cd = c.map((v, i) => lerp(v, d[i], t));
		const abc = ab.map((v, i) => lerp(v, bc[i], t));
		const bcd = bc.map((v, i) => lerp(v, cd[i], t));
		const m = abc.map((v, i) => lerp(v, bcd[i], t));
		return [
			[a, ab, abc, m],
			[m, bcd, cd, d]
		];
	};
	let seg = P;
	if (u1 < 1) seg = split(seg, u1)[0];
	if (u0 > 0) seg = split(seg, u0 / u1)[1];
	const [s, c1, c2, e] = seg;
	const unit = (p) => [(p[0] - s[0]) / (e[0] - s[0]), (p[1] - s[1]) / (e[1] - s[1])];
	const [x1, y1] = unit(c1);
	const [x2, y2] = unit(c2);
	return `cubic-bezier(${round(x1)}, ${round(y1)}, ${round(x2)}, ${round(y2)})`;
}

// Distance along the track, as translate(corner) rotate(angle) translateY(-radius). Percentages
// are of the pill itself.
const pct = (v, of) => `${round((v / of) * 100)}%`;
function transform(s, scale) {
	let cx, cy, th;
	if (s <= A) [cx, cy, th] = [s, -A, 0];
	else if (s <= A + ARC) [cx, cy, th] = [A, -A, ((s - A) / R) * (180 / Math.PI)];
	else [cx, cy, th] = [A, -A + (s - A - ARC), 90];
	return `translate(${pct(cx, W)}, ${pct(cy, H)}) rotate(${round(th)}deg) translateY(${pct(-R, H)}) scale(${round(scale)})`;
}

const off = (v) => `${round(v)}%`;
const breaks = [A, A + ARC];

function keyframes(k) {
	const f = k / (N - 1); // share of the way from tail to head
	const stops = []; // [offset, distance, scale, timing function]

	// Reach: distance f·L·y, thinning as it stretches.
	const reachEnd = f * L;
	const cuts = breaks
		.filter((b) => b > 1e-9 && b < reachEnd - 1e-9)
		.map((b) => uForY(b / reachEnd));
	const us = [0, ...cuts, 1];
	for (let i = 0; i < us.length - 1; i++) {
		const [x, y] = at(us[i]);
		stops.push([
			REACH[0] + x * (REACH[1] - REACH[0]),
			reachEnd * y,
			1 - (1 - THIN) * y,
			sub(us[i], us[i + 1])
		]);
	}

	// Hold, then gather: the rest of the step, filling out again.
	const span = (1 - f) * L;
	const gcuts = breaks
		.filter((b) => b > reachEnd + 1e-9 && b < L - 1e-9)
		.map((b) => uForY((b - reachEnd) / span));
	const gus = [0, ...gcuts, 1];
	stops.push([REACH[1], reachEnd, THIN, null]);
	for (let i = 0; i < gus.length - 1; i++) {
		const [x, z] = at(gus[i]);
		stops.push([
			GATHER[0] + x * (GATHER[1] - GATHER[0]),
			reachEnd + span * z,
			THIN + (1 - THIN) * z,
			sub(gus[i], gus[i + 1])
		]);
	}
	stops.push([100, L, 1, null]);

	// 0% shares the first reach stop's pose, and the end of the reach shares the first gather
	// stop's pose, so the pill holds still in between.
	const block = (offsets, [, s, scale, timing]) => {
		const tf = timing ? `\n\t\t\tanimation-timing-function: ${timing};` : '';
		return `\t\t${offsets.join(',\n\t\t')} {\n\t\t\ttransform: ${transform(s, scale)};${tf}\n\t\t}`;
	};
	const lines = [block(['0%', off(stops[0][0])], stops[0])];
	for (let i = 1; i < stops.length; i++) {
		const st = stops[i];
		if (st[3] === null && st[0] === REACH[1]) {
			const g = stops[++i];
			lines.push(block([off(st[0]), off(g[0])], g));
		} else {
			lines.push(block([off(st[0])], st));
		}
	}
	return `\t@keyframes b${k} {\n${lines.join('\n')}\n\t}`;
}

const pills = Array.from({ length: N }, (_, k) => k);
const ease = `cubic-bezier(${EASE.join(', ')})`;

const file = `<!--
	@component
	A worm inching round a rounded square, stretching round each corner, then gathering up.
-->
<script lang="ts">
	import Root from '../internal/Root.svelte';
	import { durations } from '../motion.js';
	import type { SpinnerProps } from '../types.js';

	let props: SpinnerProps = $props();
</script>

<Root name="inchworm" defaultDuration={durations.inchworm} {...props}>
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
		<rect x="2.5" y="2.5" width="19" height="19" rx="6" />
	</svg>
	<span class="side">
${pills.map((k) => `\t\t<span class="bead b${k}"></span>`).join('\n')}
	</span>
</Root>

<style>
	svg,
	.side {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	/*
	 * The worm is a chain of ${N} overlapping pills, each held at a fixed share of the way from
	 * tail to head. Every pill rides the same track, 3.5 in from the outline and concentric with
	 * it: slide along the top, swing round the corner, slide down the side. Written as
	 * translate(corner) rotate(angle) translateY(-radius), so plain interpolation keeps each
	 * pill on the curve and turned along it. Percentages are of the pill itself (${W} × ${H}). The
	 * tail is b0, the head b${N - 1}.
	 */
	.bead {
		position: absolute;
		left: calc(${12 - W / 2} / 24 * 100%);
		top: calc(${12 - H / 2} / 24 * 100%);
		width: calc(${W} / 24 * 100%);
		height: calc(${H} / 24 * 100%);
		border-radius: 999px;
		background: currentColor;
	}

	.side,
	.bead {
		animation-iteration-count: infinite;
		animation-play-state: var(--_play-state);
		/* At rest it's stretched round the top-right corner. */
		animation-delay: calc(var(--_duration) * -0.13);
	}

	/*
	 * Each step ends gathered at the side's middle, exactly where the next one starts a quarter
	 * turn on, so the whole track turns under the worm in a single jump nobody sees.
	 */
	.side {
		animation-name: side;
		animation-duration: var(--_duration);
		animation-timing-function: steps(4, end);
	}

	.bead {
		animation-duration: calc(var(--_duration) / 4);
	}

${pills.map((k) => `\t.b${k} {\n\t\tanimation-name: b${k};\n\t}`).join('\n\n')}

	@keyframes side {
		to {
			transform: rotate(1turn);
		}
	}

	/*
	 * One step, computed by scripts/inchworm.mjs rather than written by hand. Planted at the
	 * top's middle, the head reaches round the corner to the side's middle (${REACH[0]}–${REACH[1]}%), the
	 * briefest hold, then the tail follows (${GATHER[0]}–${GATHER[1]}%), both on ${ease}.
	 * Pill k sits k/${N - 1} of the way from tail to head, and thins to ${THIN} at full stretch. Its
	 * easing is split, de Casteljau style, wherever it crosses from straight to curve, so each
	 * segment interpolates along one piece of track.
	 */
${pills.map(keyframes).join('\n\n')}

	@media (prefers-reduced-motion: reduce) {
		.side,
		.bead {
			animation-play-state: paused;
		}
	}
</style>
`;

const out = fileURLToPath(new URL('../src/lib/spinners/Inchworm.svelte', import.meta.url));
writeFileSync(out, file);
console.log(`Wrote ${out} (${N} pills, ${W} long)`);
