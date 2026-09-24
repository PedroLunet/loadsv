<!--
	Browse: nothing to press. All 28 spinners at once, each living in the one piece of UI
	it suits best.
-->
<script lang="ts">
	import {
		Arc,
		Atom,
		Blocks,
		Bounce,
		BouncingDots,
		CircularDots,
		Classic,
		Clock,
		Comet,
		Dual,
		Eclipse,
		Flip,
		Handoff,
		Hourglass,
		Inchworm,
		InfinityLoop,
		Leap,
		LinearDots,
		NewtonsCradle,
		Pulse,
		Ribbon,
		Ring,
		Ripple,
		Slide,
		Snake,
		Spark,
		Swirl,
		Wave
	} from '$lib';
	import { resolve } from '$app/paths';
	import CopyButton from '$site/components/CopyButton.svelte';
	import Icon from '$site/components/Icon.svelte';
	import Tile from '$site/components/SceneTile.svelte';

	const btn = 'inline-flex h-8 items-center gap-2 rounded-lg px-3 text-[13px] font-medium';
	const primary = `${btn} bg-neutral-950 text-white`;
	const secondary = `${btn} border border-neutral-200 bg-white text-neutral-700`;
	const card =
		'rounded-xl border border-neutral-200/80 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]';
	const field =
		'flex h-9 items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 text-[13px]';
	const title = 'text-[13px] font-medium text-neutral-900';
	const muted = 'text-[12.5px] text-neutral-500';

	const invoices = [
		{ id: 'INV-2041', client: 'Acme Co', amount: '$1,240.00', synced: false },
		{ id: 'INV-2040', client: 'Globex', amount: '$320.00', synced: true },
		{ id: 'INV-2039', client: 'Initech', amount: '$89.00', synced: false }
	];
</script>

<svelte:head>
	<title>Browse — loadsv</title>
	<meta
		name="description"
		content="All 28 loadsv spinners, each shown in the piece of UI it suits best."
	/>
</svelte:head>

<div class="mx-auto max-w-[70rem] px-6">
	<section class="pt-14 pb-14 sm:pt-20">
		<h1 class="max-w-xl text-[44px] leading-[1.02] font-semibold tracking-[-0.035em] text-balance">
			Spinners that fit right in.
		</h1>
		<p class="mt-4 max-w-md text-[16px] leading-relaxed text-pretty text-neutral-600">
			28 loading indicators for Svelte, each shown where it belongs. Pure CSS, no dependencies, and
			they hold still for anyone who prefers less motion.
		</p>
		<div class="mt-7 flex flex-wrap items-center gap-2">
			<div
				class="flex h-10 w-64 items-center justify-between rounded-[10px] border border-neutral-200 bg-white pr-1.5 pl-3.5 font-mono text-[13px] shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
			>
				<code><span class="mr-2 text-neutral-400 select-none">$</span>npm i loadsv</code>
				<CopyButton text="npm install loadsv" label="Copy install command" />
			</div>
			<a
				href={resolve('/spinners/arc')}
				class="flex h-10 items-center gap-1 rounded-[10px] px-3.5 text-[14px] font-medium text-neutral-700 transition-[background-color,scale] duration-150 ease-out hover:bg-neutral-100 active:scale-[0.97]"
				>Read the docs <Icon name="chevron" size={14} /></a
			>
		</div>
	</section>

	<ul
		class="grid grid-cols-1 gap-x-4 gap-y-7 pb-24 sm:grid-cols-2 lg:grid-flow-dense lg:grid-cols-6"
	>
		<Tile slug="arc" context="In a button">
			<div class={[card, 'w-full max-w-64 p-3.5']}>
				<p class={title}>Project name</p>
				<div class={[field, 'mt-1.5 h-8 text-neutral-900']}>loadsv-docs</div>
				<div class="mt-3 flex justify-end gap-1">
					<span class={[btn, 'text-neutral-500']}>Cancel</span>
					<span class={primary}><Arc size={14} /> Saving…</span>
				</div>
			</div>
		</Tile>

		<Tile slug="ring" context="In a search field">
			<div class="w-full max-w-64">
				<div class={field}>
					<span class="text-neutral-400"><Icon name="search" size={14} /></span>
					<span class="flex-1 text-neutral-900">svelte spin</span>
					<span class="text-neutral-500"><Ring size={14} /></span>
				</div>
				<p class={[muted, 'mt-2 px-1']}>Searching 1,284 packages</p>
			</div>
		</Tile>

		<Tile slug="pulse" context="In a status pill">
			<div class="flex flex-col items-center gap-2.5">
				<span
					class="inline-flex h-8 items-center gap-2 rounded-full border border-neutral-200 bg-white pr-3.5 pl-2.5 text-[13px] text-neutral-700 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
				>
					<span class="text-amber-500"><Pulse size={14} /></span> Connecting to eu-west-1
				</span>
				<span class={muted}>Attempt 2 of 5</span>
			</div>
		</Tile>

		<Tile slug="snake" context="In a toast" span={3}>
			<div
				class={[
					card,
					'flex w-full max-w-80 items-center gap-3 px-3.5 py-3 shadow-[0_6px_20px_rgba(0,0,0,0.08)]'
				]}
			>
				<Snake size={16} />
				<div class="min-w-0 flex-1 text-[13px]">
					<p class="font-medium text-neutral-900">Deploying loadsv-docs</p>
					<p class="text-neutral-500">Building in 3 regions · 12s</p>
				</div>
				<span class={[secondary, 'h-7 px-2.5 text-[12.5px]']}>Logs</span>
			</div>
		</Tile>

		<Tile slug="bouncing-dots" context="Typing indicator" span={3}>
			<div class="flex w-full max-w-80 flex-col gap-2">
				<span
					class="self-end rounded-2xl rounded-br-md bg-neutral-950 px-3 py-2 text-[13px] text-white"
					>Can you summarize the changelog?</span
				>
				<div class="flex items-end gap-2">
					<span class="size-6 rounded-full bg-linear-to-br from-orange-300 to-rose-400"></span>
					<span
						class="grid h-9 w-14 place-items-center rounded-2xl rounded-bl-md bg-white text-neutral-500 ring-1 ring-neutral-200/70"
						><BouncingDots size={20} /></span
					>
				</div>
			</div>
		</Tile>

		<Tile slug="classic" context="In a table" span={4}>
			<div class={[card, 'w-full max-w-[34rem] overflow-hidden text-[13px]']}>
				<div class="flex items-center justify-between border-b border-neutral-100 px-4 py-2.5">
					<span class="font-medium text-neutral-900">Invoices</span>
					<span class="text-[12px] text-neutral-400">Syncing with Stripe</span>
				</div>
				{#each invoices as row (row.id)}
					<div class="flex items-center gap-4 border-b border-neutral-100 px-4 py-2 last:border-0">
						<span class="hidden w-20 font-mono text-[12px] text-neutral-400 sm:block">{row.id}</span
						>
						<span class="flex-1 text-neutral-800">{row.client}</span>
						<span class="text-neutral-800 tabular-nums">{row.amount}</span>
						<span
							class={[
								'flex w-20 items-center justify-end gap-1.5 text-[12px]',
								row.synced ? 'text-emerald-600' : 'text-neutral-500'
							]}
						>
							{#if row.synced}<Icon name="check" size={12} /> Synced{:else}<Classic size={12} /> Syncing{/if}
						</span>
					</div>
				{/each}
			</div>
		</Tile>

		<Tile slug="clock" context="In a scheduled job">
			<div class={[card, 'flex w-full max-w-64 items-center gap-3 p-3.5']}>
				<span class="grid size-9 place-items-center rounded-lg bg-neutral-100 text-neutral-600"
					><Clock size={18} /></span
				>
				<div class="min-w-0 flex-1">
					<p class={title}>Nightly backup</p>
					<p class={muted}>Next run in 4 min</p>
				</div>
				<span class="h-5 w-8 rounded-full bg-neutral-950 p-0.5"
					><span class="block size-4 translate-x-3 rounded-full bg-white"></span></span
				>
			</div>
		</Tile>

		<Tile slug="hourglass" context="In a queue">
			<div class="flex flex-col items-center text-center">
				<span class="text-neutral-700"><Hourglass size={28} /></span>
				<p class="mt-3 text-[14px] font-medium text-neutral-900">You’re in line</p>
				<p class={[muted, 'mt-0.5']}>Position 3 · about 2 minutes</p>
			</div>
		</Tile>

		<Tile slug="circular-dots" context="Pull to refresh">
			<div
				class="h-40 w-full max-w-56 self-end overflow-hidden rounded-t-[22px] border border-b-0 border-neutral-200/80 bg-white"
			>
				<div class="flex flex-col items-center gap-1 pt-3 pb-2 text-neutral-500">
					<CircularDots size={18} />
					<span class="text-[11px]">Refreshing</span>
				</div>
				<div class="space-y-3 px-4">
					{#each [0.75, 0.6, 0.7] as width (width)}
						<div class="flex items-center gap-3">
							<span class="size-7 shrink-0 rounded-full bg-neutral-100"></span>
							<div class="flex-1 space-y-1.5">
								<div class="h-2 rounded-full bg-neutral-200/80" style:width="{width * 100}%"></div>
								<div class="h-2 w-1/2 rounded-full bg-neutral-100"></div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</Tile>

		<Tile slug="eclipse" context="Pairing a device">
			<div class={[card, 'w-full max-w-64 divide-y divide-neutral-100 text-[13px]']}>
				<div class="flex items-center justify-between px-3.5 py-2.5">
					<span class="text-neutral-800">AirPods Pro</span>
					<span class="text-[12px] text-neutral-400">Connected</span>
				</div>
				<div class="flex items-center justify-between px-3.5 py-2.5">
					<span class="font-medium text-neutral-900">MX Keys</span>
					<span class="flex items-center gap-2 text-[12px] text-neutral-500"
						>Pairing <Eclipse size={14} /></span
					>
				</div>
				<div class="flex items-center justify-between px-3.5 py-2.5">
					<span class="text-neutral-800">Magic Trackpad</span>
					<span class="text-[12px] text-neutral-400">Not connected</span>
				</div>
			</div>
		</Tile>

		<Tile slug="linear-dots" context="In a terminal" span={3}>
			<div class={[card, 'w-full max-w-96 p-4 font-mono text-[12px] leading-[1.8]']}>
				<p><span class="text-neutral-400">$</span> npm install loadsv</p>
				<p class="text-neutral-500">added 1 package in 812ms</p>
				<p><span class="text-neutral-400">$</span> npm run build</p>
				<p class="flex items-center gap-2 text-neutral-500">
					vite building for production <LinearDots size={14} />
				</p>
			</div>
		</Tile>

		<Tile slug="wave" context="Transcribing audio" span={3}>
			<div class={[card, 'flex w-full max-w-96 items-center gap-3 p-3']}>
				<span class="grid size-9 shrink-0 place-items-center rounded-full bg-neutral-950 text-white"
					><Icon name="play" size={14} /></span
				>
				<div class="min-w-0 flex-1">
					<p class={title}>Standup notes</p>
					<p class={muted}>Voice memo · 0:42</p>
				</div>
				<span class="flex items-center gap-2 text-[12px] text-neutral-500"
					><Wave size={14} /> Transcribing</span
				>
			</div>
		</Tile>

		<Tile slug="ribbon" context="Formatting on save">
			<div class={[card, 'w-full max-w-64 overflow-hidden']}>
				<div
					class="flex items-center justify-between border-b border-neutral-100 px-3.5 py-2.5 text-[12.5px]"
				>
					<span class="font-mono text-neutral-900">+page.svelte</span>
					<span class="flex items-center gap-1.5 text-neutral-500"
						><Ribbon size={16} /> Formatting</span
					>
				</div>
				<div class="space-y-2.5 p-3.5">
					<div class="h-2 w-2/5 rounded-full bg-neutral-200/80"></div>
					<div class="ml-4 h-2 w-3/5 rounded-full bg-neutral-100"></div>
					<div class="ml-4 h-2 w-1/2 rounded-full bg-neutral-100"></div>
					<div class="h-2 w-1/4 rounded-full bg-neutral-200/80"></div>
				</div>
			</div>
		</Tile>

		<Tile slug="handoff" context="Signing in elsewhere">
			<div class={[card, 'w-full max-w-64 p-4 text-center']}>
				<p class={title}>Sign in to loadsv</p>
				<p class={[muted, 'mt-0.5']}>We’ll bring you right back</p>
				<span class={[secondary, 'mt-4 w-full justify-center']}
					><Handoff size={16} /> Redirecting to GitHub</span
				>
			</div>
		</Tile>

		<Tile slug="inchworm" context="Installing an app">
			<div class="flex items-start gap-6 text-[11px]">
				<div class="flex flex-col items-center gap-2">
					<span class="size-10 rounded-[12px] bg-linear-to-br from-sky-300 to-indigo-500"></span>
					<span class="text-neutral-500">Weather</span>
				</div>
				<!-- Drawn at 50, its outline is 40 across: the size of the icons beside it. -->
				<div class="flex flex-col items-center gap-2">
					<span class="-m-[5px] flex text-neutral-700"><Inchworm size={50} /></span>
					<span class="text-neutral-900">Installing…</span>
				</div>
				<div class="flex flex-col items-center gap-2">
					<span class="size-10 rounded-[12px] bg-linear-to-br from-amber-200 to-orange-400"></span>
					<span class="text-neutral-500">Notes</span>
				</div>
			</div>
		</Tile>

		<Tile slug="atom" context="Scanning dependencies">
			<div class={[card, 'w-full max-w-64 p-3.5 font-mono text-[12px]']}>
				<p class="flex justify-between text-neutral-500">
					svelte <span class="text-emerald-600">5.56 ✓</span>
				</p>
				<p class="mt-1.5 flex justify-between text-neutral-500">
					vite <span class="text-emerald-600">8.3 ✓</span>
				</p>
				<p class="mt-1.5 flex items-center justify-between text-neutral-900">
					tailwindcss <span class="flex items-center gap-1.5 text-neutral-500"
						>scanning <Atom size={14} /></span
					>
				</p>
			</div>
		</Tile>

		<Tile slug="comet" context="In an upload list" span={4}>
			<div class={[card, 'w-full max-w-[34rem] divide-y divide-neutral-100 text-[13px]']}>
				<div class="px-4 py-2.5">
					<div class="flex items-center gap-3">
						<span class="text-neutral-400"><Icon name="file" size={14} /></span>
						<span class="flex-1 text-neutral-900"
							>hero.png <span class="text-neutral-400">2.4 MB</span></span
						>
						<span class="flex items-center gap-2 text-[12px] text-neutral-500"
							><Comet size={14} /> 64%</span
						>
					</div>
					<div class="mt-2 ml-7 h-1 overflow-hidden rounded-full bg-neutral-100">
						<div class="h-full w-[64%] rounded-full bg-neutral-900"></div>
					</div>
				</div>
				<div class="flex items-center gap-3 px-4 py-2.5">
					<span class="text-neutral-400"><Icon name="file" size={14} /></span>
					<span class="flex-1 text-neutral-900"
						>logo.svg <span class="text-neutral-400">12 KB</span></span
					>
					<span class="flex items-center gap-1.5 text-[12px] text-emerald-600"
						><Icon name="check" size={12} /> Uploaded</span
					>
				</div>
				<div class="flex items-center gap-3 px-4 py-2.5">
					<span class="text-neutral-400"><Icon name="file" size={14} /></span>
					<span class="flex-1 text-neutral-900"
						>demo.mp4 <span class="text-neutral-400">18 MB</span></span
					>
					<span class="text-[12px] text-neutral-400">Queued</span>
				</div>
			</div>
		</Tile>

		<Tile slug="ripple" context="Finding nearby devices">
			<div class="flex flex-col items-center text-center">
				<span class="text-sky-500"><Ripple size={44} /></span>
				<p class="mt-3 text-[14px] font-medium text-neutral-900">Looking for nearby devices</p>
				<p class={[muted, 'mt-0.5']}>Keep both screens awake</p>
			</div>
		</Tile>

		<Tile slug="infinity-loop" context="Syncing across devices">
			<div class="flex flex-col items-center">
				<div class="flex items-center gap-4 text-neutral-400">
					<span class="h-9 w-12 rounded-md border-2 border-neutral-300 bg-white"></span>
					<span class="text-neutral-700"><InfinityLoop size={28} /></span>
					<span class="h-10 w-6 rounded-md border-2 border-neutral-300 bg-white"></span>
				</div>
				<p class="mt-4 text-[14px] font-medium text-neutral-900">Syncing your library</p>
				<p class={[muted, 'mt-0.5']}>1,208 of 1,530 photos</p>
			</div>
		</Tile>

		<Tile slug="newtons-cradle" context="Reconnecting">
			<div class={[card, 'w-full max-w-64 overflow-hidden']}>
				<div class="flex items-center gap-3 bg-amber-50 px-3.5 py-2.5 text-amber-800">
					<NewtonsCradle size={20} />
					<span class="flex-1 text-[12.5px]">Connection lost</span>
					<span class="text-[12px] font-medium underline underline-offset-2">Retry</span>
				</div>
				<div class="space-y-2 p-3.5">
					<div class="h-2 w-4/5 rounded-full bg-neutral-100"></div>
					<div class="h-2 w-3/5 rounded-full bg-neutral-100"></div>
				</div>
			</div>
		</Tile>

		<Tile slug="dual" context="Buffering a video">
			<div
				class="relative grid aspect-video w-full max-w-72 place-items-center overflow-hidden rounded-xl bg-linear-to-br from-neutral-700 to-neutral-900 text-white"
			>
				<Dual size={28} />
				<div class="absolute inset-x-3 bottom-3 flex items-center gap-2 text-[11px] text-white/70">
					<span>1:12</span>
					<div class="h-1 flex-1 rounded-full bg-white/20">
						<div class="h-full w-[38%] rounded-full bg-white"></div>
					</div>
					<span>3:05</span>
				</div>
			</div>
		</Tile>

		<Tile slug="blocks" context="An empty chart">
			<div class={[card, 'w-full max-w-80']}>
				<div class="flex items-center justify-between border-b border-neutral-100 px-4 py-2.5">
					<span class={title}>Revenue</span>
					<span class="rounded-md bg-neutral-100 px-2 py-0.5 text-[11.5px] text-neutral-600"
						>Last 30 days</span
					>
				</div>
				<div class="flex h-28 flex-col items-center justify-center gap-2.5 text-neutral-500">
					<Blocks size={22} />
					<span class="text-[12.5px]">Crunching the numbers</span>
				</div>
			</div>
		</Tile>

		<Tile slug="spark" context="Generating an image">
			<div class="w-full max-w-48">
				<div
					class="grid aspect-[4/3] place-items-center rounded-xl bg-linear-to-br from-violet-100 via-fuchsia-50 to-amber-50 text-violet-500 ring-1 ring-neutral-200/70"
				>
					<Spark size={28} />
				</div>
				<p class="mt-3 flex justify-between text-[12.5px]">
					<span class="text-neutral-900">Painting variations</span>
					<span class="text-neutral-400 tabular-nums">2 of 4</span>
				</p>
			</div>
		</Tile>

		<Tile slug="bounce" context="A cold start">
			<div class="flex flex-col items-center text-center">
				<span class="text-neutral-800"><Bounce size={32} /></span>
				<p class="mt-2 text-[14px] font-medium text-neutral-900">Waking up the server</p>
				<p class={[muted, 'mt-0.5']}>Free instances nap after 15 min</p>
			</div>
		</Tile>

		<Tile slug="leap" context="Reordering a list">
			<div class={[card, 'w-full max-w-64']}>
				<div
					class="flex items-center justify-between border-b border-neutral-100 px-3.5 py-2.5 text-[12.5px]"
				>
					<span class="text-neutral-500">Sort by <span class="text-neutral-900">Date</span></span>
					<span class="text-neutral-500"><Leap size={16} /></span>
				</div>
				<div class="space-y-2.5 p-3.5">
					<div class="h-2 w-4/5 rounded-full bg-neutral-100"></div>
					<div class="h-2 w-3/5 rounded-full bg-neutral-100"></div>
					<div class="h-2 w-2/3 rounded-full bg-neutral-100"></div>
				</div>
			</div>
		</Tile>

		<Tile slug="slide" context="Optimizing images">
			<div class="w-full max-w-64">
				<div class="grid grid-cols-4 gap-1.5">
					{#each { length: 4 }, i (i)}
						<span
							class={[
								'grid aspect-square place-items-center rounded-md',
								i === 1 ? 'bg-white text-neutral-600 ring-1 ring-neutral-200' : 'bg-neutral-200/70'
							]}
							>{#if i === 1}<Slide size={16} />{/if}</span
						>
					{/each}
				</div>
				<p class="mt-3 flex justify-between text-[12.5px]">
					<span class="text-neutral-900">Compressing photos</span>
					<span class="text-neutral-400 tabular-nums">4 of 12</span>
				</p>
			</div>
		</Tile>

		<Tile slug="swirl" context="Taking a payment" span={3}>
			<div class={[card, 'w-full max-w-64 p-4 text-center']}>
				<p class={muted}>Pay Acme Co</p>
				<p class="mt-1 text-[26px] font-semibold tracking-tight text-neutral-950 tabular-nums">
					$24.00
				</p>
				<p class="text-[12px] text-neutral-400">Visa •••• 4242</p>
				<span class={[primary, 'mt-4 w-full justify-center']}><Swirl size={14} /> Processing</span>
			</div>
		</Tile>

		<Tile slug="flip" context="Rendering a preview" span={3}>
			<div class={[card, 'flex w-full max-w-72 items-center gap-3 p-3']}>
				<span
					class="grid size-14 shrink-0 place-items-center rounded-lg bg-neutral-100 text-neutral-500"
					><Flip size={20} /></span
				>
				<div class="min-w-0 flex-1">
					<p class={[title, 'truncate']}>cover-final-v3.fig</p>
					<p class={muted}>Rendering preview</p>
				</div>
			</div>
		</Tile>
	</ul>
</div>
